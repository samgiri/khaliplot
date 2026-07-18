import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getUsersOverview } from "@/lib/admin-stats";

// GET  /api/admin/users               — dashboard aggregates + list/search/filter
// PATCH /api/admin/users              — moderate a user (role / subscription_tier)
//
// Backed by the `profiles` table (schema_phase1_auth.sql + schema_part2_profiles.sql).
//
// The GET response is a superset: the aggregate fields the Users page charts
// consume (activeUsers, signupTrend, roleBreakdown) plus the paginated `users`
// list used by the moderation table.

const USER_COLUMNS =
  "id, name, email, phone, role, location, state, city, subscription_tier, sub_expires_at, created_at";

const ROLES = ["buyer", "seller", "broker", "builder"] as const;
const TIERS = ["free", "featured", "boost"] as const;

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  location: string | null;
  state: string | null;
  city: string | null;
  subscription_tier: string;
  sub_expires_at: string | null;
  created_at: string;
}

// GET — list users, newest first. Supports ?q= (name/email/phone search),
// ?role=, ?tier= and ?limit= (default 100, max 500).
export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  // Aggregates are computed over ALL profiles (not the filtered/limited list),
  // and getUsersOverview() handles the no-DB fallback on its own.
  const overview = await getUsersOverview();
  const aggregates = {
    live: overview.live,
    activeUsers: overview.activeUsers,
    signupTrend: overview.signupTrend.map((p) => ({ date: p.date, count: p.value })),
    roleBreakdown: Object.fromEntries(overview.roleBreakdown.map((r) => [r.role, r.count])),
  };

  if (!dbConfigured()) {
    return NextResponse.json({ ...aggregates, users: [], total: 0 });
  }

  const params = request.nextUrl.searchParams;
  const q = params.get("q")?.trim();
  const role = params.get("role")?.trim();
  const tier = params.get("tier")?.trim();
  const limit = Math.min(Number(params.get("limit")) || 100, 500);

  let query = supabaseAdmin
    .from("profiles")
    .select(USER_COLUMNS, { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (role && ROLES.includes(role as (typeof ROLES)[number])) {
    query = query.eq("role", role);
  }
  if (tier && TIERS.includes(tier as (typeof TIERS)[number])) {
    query = query.eq("subscription_tier", tier);
  }
  if (q) {
    // Escape PostgREST wildcards/commas so a search term can't break the or() filter.
    const safe = q.replace(/[%,()]/g, " ");
    query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ...aggregates, users: (data ?? []) as UserRow[], total: count ?? 0 });
}

// PATCH — update a user's role and/or subscription tier. Body: { id, role?, subscription_tier? }.
export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: { role?: string; subscription_tier?: string } = {};
  if (body.role !== undefined) {
    if (!ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    updates.role = body.role;
  }
  if (body.subscription_tier !== undefined) {
    if (!TIERS.includes(body.subscription_tier)) {
      return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 });
    }
    updates.subscription_tier = body.subscription_tier;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", body.id)
    .select(USER_COLUMNS)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ user: data as UserRow });
}
