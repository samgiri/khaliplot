import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { REVEAL_PRICE } from "@/lib/admin-stats";

// GET /api/admin/transactions — the money trail: paid contact reveals and
// subscription purchases. Backed by `contact_reveals` and `subscriptions`
// (schema_phase1_auth.sql). Full payment records (Razorpay) arrive later; until
// then revenue is estimated as paid reveals × REVEAL_PRICE, mirroring the
// Overview dashboard.

interface RevealRow {
  id: string;
  viewer_id: string;
  target_owner_id: string;
  plot_id: string;
  tier_used: string;
  created_at: string;
}

interface SubscriptionRow {
  id: string;
  user_id: string;
  tier: string;
  amount: number;
  status: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({
      live: false,
      reveals: [],
      subscriptions: [],
      totals: { reveals: 0, paidReveals: 0, subscriptions: 0, revenue: 0 },
    });
  }

  const limit = Math.min(Number(request.nextUrl.searchParams.get("limit")) || 100, 500);

  const [revealsRes, subsRes] = await Promise.all([
    supabaseAdmin
      .from("contact_reveals")
      .select("id, viewer_id, target_owner_id, plot_id, tier_used, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
    supabaseAdmin
      .from("subscriptions")
      .select("id, user_id, tier, amount, status, started_at, expires_at, created_at")
      .order("created_at", { ascending: false })
      .limit(limit),
  ]);

  if (revealsRes.error) {
    return NextResponse.json({ error: revealsRes.error.message }, { status: 500 });
  }
  // `subscriptions` may not be populated yet; treat a query error as "none".
  const reveals = (revealsRes.data ?? []) as RevealRow[];
  const subscriptions = (subsRes.data ?? []) as SubscriptionRow[];

  const paidReveals = reveals.filter((r) => r.tier_used && r.tier_used !== "free").length;
  const subsRevenue = subscriptions.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  return NextResponse.json({
    live: true,
    reveals,
    subscriptions,
    totals: {
      reveals: reveals.length,
      paidReveals,
      subscriptions: subscriptions.length,
      revenue: paidReveals * REVEAL_PRICE + subsRevenue,
    },
  });
}
