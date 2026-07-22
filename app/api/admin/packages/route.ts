import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isPartnerType } from "@/lib/partner-types";
import { getPackageType, isPackageKey, packageLabel } from "@/lib/package-types";

// GET   /api/admin/packages — every assigned package (subscriptions row),
//       newest first, joined with the user's name/email for display.
// POST  /api/admin/packages — assign a package to a user: creates the
//       subscriptions row and mirrors the tier/expiry/partner type onto the
//       user's profile so it actually grants the listing/reveal quota (see
//       lib/listings-quota.ts) — same table the future Razorpay (Part 5)
//       checkout will write paid rows into. Reveal Pack is the one exception:
//       it's a top-up, not a plan, so it's never mirrored onto the profile
//       (see lib/package-types.ts assignableToProfile) — Part 5 wires real
//       reveal-quota tracking for it later.
// PATCH /api/admin/packages — { id, action: "extend", days } or
//       { id, action: "cancel" }. Only mirrors onto the profile when this
//       row is the user's current (latest non-cancelled) subscription, so
//       cancelling/extending an old historical row never clobbers whatever
//       package the user has since moved on to.

const SELECT_COLUMNS =
  "id, user_id, tier, package_key, amount, status, started_at, expires_at, partner_type, notes, is_promotional, created_at";

interface PackageRow {
  id: string;
  user_id: string;
  tier: string;
  package_key: string | null;
  amount: number;
  status: string;
  started_at: string;
  expires_at: string | null;
  partner_type: string | null;
  notes: string;
  is_promotional: boolean;
  created_at: string;
}

interface PackageRowWithUser extends PackageRow {
  user_name: string | null;
  user_email: string | null;
  effective_status: "active" | "expired" | "cancelled";
}

function effectiveStatus(row: Pick<PackageRow, "status" | "expires_at">): "active" | "expired" | "cancelled" {
  if (row.status === "cancelled") return "cancelled";
  const dateExpired = row.expires_at ? new Date(row.expires_at).getTime() < Date.now() : false;
  if (row.status === "expired" || dateExpired) return "expired";
  return "active";
}

/** Whether extending/cancelling this row should also change the user's live
 * profile tier — false for Reveal Pack (never mirrored in the first place). */
function assignableToProfile(row: Pick<PackageRow, "tier" | "package_key">): boolean {
  const def = getPackageType(row.package_key);
  return def ? def.assignableToProfile : row.tier !== "reveal_pack";
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({
      live: false,
      packages: [],
      totals: { active: 0, revenue: 0, mostPopular: null, expiringSoon: 0 },
    });
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 200, 500);

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(SELECT_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as PackageRow[];
  const userIds = [...new Set(rows.map((r) => r.user_id))];

  const profilesById = new Map<string, { name: string | null; email: string | null }>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email")
      .in("id", userIds);
    for (const p of (profiles ?? []) as { id: string; name: string | null; email: string | null }[]) {
      profilesById.set(p.id, { name: p.name, email: p.email });
    }
  }

  const packages: PackageRowWithUser[] = rows.map((r) => ({
    ...r,
    user_name: profilesById.get(r.user_id)?.name ?? null,
    user_email: profilesById.get(r.user_id)?.email ?? null,
    effective_status: effectiveStatus(r),
  }));

  const active = packages.filter((p) => p.effective_status === "active").length;
  const revenue = packages.reduce((sum, p) => sum + (p.is_promotional ? 0 : Number(p.amount) || 0), 0);

  const popularityByLabel = new Map<string, number>();
  for (const p of packages) {
    const label = packageLabel(p.package_key, p.tier);
    popularityByLabel.set(label, (popularityByLabel.get(label) ?? 0) + 1);
  }
  let mostPopular: { label: string; count: number } | null = null;
  for (const [label, count] of popularityByLabel) {
    if (!mostPopular || count > mostPopular.count) mostPopular = { label, count };
  }

  const sevenDaysFromNowMs = Date.now() + 7 * 86_400_000;
  const expiringSoon = packages.filter(
    (p) =>
      p.effective_status === "active" &&
      p.expires_at &&
      new Date(p.expires_at).getTime() <= sevenDaysFromNowMs
  ).length;

  return NextResponse.json({
    live: true,
    packages,
    totals: { active, revenue, mostPopular, expiringSoon },
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.user_id !== "string") {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }
  if (!isPackageKey(body.package_key)) {
    return NextResponse.json({ error: "Invalid package type" }, { status: 400 });
  }
  const def = getPackageType(body.package_key)!;

  let partnerType: string | null = null;
  if (body.partner_type !== undefined && body.partner_type !== null && body.partner_type !== "") {
    if (!isPartnerType(body.partner_type)) {
      return NextResponse.json({ error: "Invalid partner type" }, { status: 400 });
    }
    partnerType = body.partner_type;
  }

  const isPromotional = body.is_promotional !== false; // default true (free package)
  const amount = isPromotional ? 0 : Math.max(0, Number(body.amount) || 0);
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 200) : "";
  const expiresAt = typeof body.expires_at === "string" && body.expires_at ? body.expires_at : null;
  const startedAt = typeof body.started_at === "string" && body.started_at ? body.started_at : undefined;

  const { data: created, error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      user_id: body.user_id,
      tier: def.tier,
      package_key: def.key,
      amount,
      status: "active",
      ...(startedAt ? { started_at: startedAt } : {}),
      expires_at: expiresAt,
      partner_type: partnerType,
      notes,
      is_promotional: isPromotional,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  if (def.assignableToProfile) {
    const profileUpdates: Record<string, unknown> = {
      subscription_tier: def.tier,
      sub_expires_at: expiresAt,
    };
    if (partnerType !== null) profileUpdates.partner_type = partnerType;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update(profileUpdates)
      .eq("id", body.user_id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ package: created as PackageRow });
}

// PATCH — extend or cancel an assigned package.
// Body: { id, action: "extend", days } or { id, action: "cancel" }.
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (body.action !== "extend" && body.action !== "cancel") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { data: current, error: fetchError } = await supabaseAdmin
    .from("subscriptions")
    .select("id, user_id, tier, package_key, status, expires_at")
    .eq("id", body.id)
    .single();

  if (fetchError || !current) {
    return NextResponse.json({ error: fetchError?.message || "Package not found" }, { status: 404 });
  }
  const row = current as Pick<PackageRow, "id" | "user_id" | "tier" | "package_key" | "status" | "expires_at">;

  // Only sync the profile when this is the user's current (latest
  // non-cancelled) subscription — never clobber a newer package.
  const { data: latest } = await supabaseAdmin
    .from("subscriptions")
    .select("id")
    .eq("user_id", row.user_id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(1);
  const isCurrent = (latest?.[0] as { id: string } | undefined)?.id === row.id;
  const syncProfile = isCurrent && assignableToProfile(row);

  if (body.action === "extend") {
    const days = Number(body.days);
    if (!Number.isFinite(days) || days <= 0) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    const base = row.expires_at ? new Date(row.expires_at) : new Date();
    const from = base.getTime() < Date.now() ? new Date() : base;
    const newExpiresAt = new Date(from.getTime() + days * 86_400_000).toISOString();

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("subscriptions")
      .update({ expires_at: newExpiresAt, status: "active" })
      .eq("id", row.id)
      .select(SELECT_COLUMNS)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    if (syncProfile) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ subscription_tier: row.tier, sub_expires_at: newExpiresAt })
        .eq("id", row.user_id);
      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ package: updated as PackageRow });
  }

  // action === "cancel"
  const { data: updated, error: updateError } = await supabaseAdmin
    .from("subscriptions")
    .update({ status: "cancelled" })
    .eq("id", row.id)
    .select(SELECT_COLUMNS)
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (syncProfile) {
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ subscription_tier: "free", sub_expires_at: null })
      .eq("id", row.user_id);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ package: updated as PackageRow });
}
