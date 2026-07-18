import { NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAdminOverview } from "@/lib/admin-stats";

// GET /api/admin/analytics — the Overview aggregates (totals, 30-day series,
// city distribution) plus extra breakdowns the Overview page doesn't show:
// listings by status, users by role, reveals by tier. Backed by `listings`,
// `profiles` and `contact_reveals`.

function tally<T extends string>(rows: { key: T | null }[]): { key: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = r.key ?? "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  // getAdminOverview() already falls back to seed data when the DB isn't set up.
  const overview = await getAdminOverview();

  if (!dbConfigured()) {
    return NextResponse.json({
      live: false,
      overview,
      breakdowns: { listingsByStatus: [], usersByRole: [], revealsByTier: [] },
    });
  }

  const [listingsRes, usersRes, revealsRes] = await Promise.all([
    supabaseAdmin.from("listings").select("status"),
    supabaseAdmin.from("profiles").select("role"),
    supabaseAdmin.from("contact_reveals").select("tier_used"),
  ]);

  const listingsByStatus = tally(
    ((listingsRes.data ?? []) as { status: string | null }[]).map((r) => ({ key: r.status }))
  );
  const usersByRole = tally(
    ((usersRes.data ?? []) as { role: string | null }[]).map((r) => ({ key: r.role }))
  );
  const revealsByTier = tally(
    ((revealsRes.data ?? []) as { tier_used: string | null }[]).map((r) => ({ key: r.tier_used }))
  );

  return NextResponse.json({
    live: true,
    overview,
    breakdowns: { listingsByStatus, usersByRole, revealsByTier },
  });
}
