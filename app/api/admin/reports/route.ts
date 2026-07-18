import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { REVEAL_PRICE } from "@/lib/admin-stats";

// GET /api/admin/reports?period=day|week|month — a point-in-time summary of
// activity in the trailing window: new users, new listings, contact reveals and
// estimated revenue. This is the data behind the "scheduled daily/weekly/monthly
// summary" section; the CSV export lives at /api/admin/export.

const PERIODS = { day: 1, week: 7, month: 30 } as const;
type Period = keyof typeof PERIODS;

interface RevealCreatedRow {
  created_at: string;
  tier_used: string;
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const periodParam = (request.nextUrl.searchParams.get("period") ?? "week") as Period;
  const period: Period = periodParam in PERIODS ? periodParam : "week";
  const days = PERIODS[period];
  const sinceIso = new Date(Date.now() - days * 86_400_000).toISOString();

  if (!dbConfigured()) {
    return NextResponse.json({
      live: false,
      period,
      since: sinceIso,
      summary: { newUsers: 0, newListings: 0, reveals: 0, paidReveals: 0, revenue: 0 },
    });
  }

  const [usersRes, listingsRes, revealsRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("created_at").gte("created_at", sinceIso),
    supabaseAdmin.from("listings").select("created_at").gte("created_at", sinceIso),
    supabaseAdmin.from("contact_reveals").select("created_at, tier_used").gte("created_at", sinceIso),
  ]);

  if (usersRes.error || listingsRes.error || revealsRes.error) {
    const message =
      usersRes.error?.message ?? listingsRes.error?.message ?? revealsRes.error?.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const newUsers = (usersRes.data ?? []).length;
  const newListings = (listingsRes.data ?? []).length;
  const reveals = (revealsRes.data ?? []) as RevealCreatedRow[];
  const paidReveals = reveals.filter((r) => r.tier_used && r.tier_used !== "free").length;

  return NextResponse.json({
    live: true,
    period,
    since: sinceIso,
    summary: {
      newUsers,
      newListings,
      reveals: reveals.length,
      paidReveals,
      revenue: paidReveals * REVEAL_PRICE,
    },
  });
}
