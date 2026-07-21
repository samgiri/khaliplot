import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { isPartnerType } from "@/lib/partner-types";

// GET  /api/admin/packages  — every assigned package (subscriptions row),
//      newest first, joined with the user's name/email for display.
// POST /api/admin/packages  — assign a package to a user: creates the
//      subscriptions row and mirrors the tier/expiry/partner type onto the
//      user's profile so it actually grants the listing/reveal quota (see
//      lib/listings-quota.ts) — same table the future Razorpay (Part 5)
//      checkout will write paid rows into.

const ASSIGNABLE_TIERS = ["featured", "boost"] as const;

interface PackageRow {
  id: string;
  user_id: string;
  tier: string;
  amount: number;
  status: string;
  started_at: string;
  expires_at: string | null;
  partner_type: string | null;
  notes: string;
  is_promotional: boolean;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({
      live: false,
      packages: [],
      totals: { total: 0, promotional: 0, paid: 0, revenue: 0 },
    });
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 200, 500);

  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select(
      "id, user_id, tier, amount, status, started_at, expires_at, partner_type, notes, is_promotional, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Omit<PackageRow, "user_name" | "user_email">[];
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

  const packages: PackageRow[] = rows.map((r) => ({
    ...r,
    user_name: profilesById.get(r.user_id)?.name ?? null,
    user_email: profilesById.get(r.user_id)?.email ?? null,
  }));

  const promotional = packages.filter((p) => p.is_promotional).length;
  const paid = packages.length - promotional;
  const revenue = packages.reduce((sum, p) => sum + (p.is_promotional ? 0 : Number(p.amount) || 0), 0);

  return NextResponse.json({
    live: true,
    packages,
    totals: { total: packages.length, promotional, paid, revenue },
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
  if (!ASSIGNABLE_TIERS.includes(body.tier)) {
    return NextResponse.json({ error: "Invalid package tier" }, { status: 400 });
  }
  if (!isPartnerType(body.partner_type)) {
    return NextResponse.json({ error: "Invalid partner type" }, { status: 400 });
  }

  const isPromotional = body.is_promotional !== false; // default true (free package)
  const amount = isPromotional ? 0 : Math.max(0, Number(body.amount) || 0);
  const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) : "";
  const expiresAt =
    typeof body.expires_at === "string" && body.expires_at ? body.expires_at : null;

  const { data: created, error: insertError } = await supabaseAdmin
    .from("subscriptions")
    .insert({
      user_id: body.user_id,
      tier: body.tier,
      amount,
      status: "active",
      expires_at: expiresAt,
      partner_type: body.partner_type,
      notes,
      is_promotional: isPromotional,
    })
    .select(
      "id, user_id, tier, amount, status, started_at, expires_at, partner_type, notes, is_promotional, created_at"
    )
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: body.tier,
      sub_expires_at: expiresAt,
      partner_type: body.partner_type,
    })
    .eq("id", body.user_id);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ package: created as PackageRow });
}
