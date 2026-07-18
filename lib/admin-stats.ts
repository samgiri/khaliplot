import { supabaseAdmin } from "@/lib/supabase-admin";
import { listings as seedListings } from "@/lib/data";

// Estimated value of a single paid contact reveal (₹499 Reveal Pack ÷ 10, or a
// paid-tier reveal). Used only for the revenue estimate on the dashboard.
export const REVEAL_PRICE = 499;

export interface DayPoint {
  date: string; // ISO yyyy-mm-dd
  label: string; // e.g. "12 Jul"
  value: number;
}

export interface CityCount {
  city: string;
  count: number;
}

export interface AdminOverview {
  live: boolean; // true when backed by the real database
  totals: {
    users: number;
    listings: number;
    liveListings: number;
    activeTransactions: number; // reveals in the last 30 days ~ deals in progress
    reveals: number;
    revenue: number;
  };
  thisMonth: {
    users: number;
    listings: number;
    reveals: number;
  };
  series: {
    users: DayPoint[];
    listings: DayPoint[];
    revenue: DayPoint[];
  };
  cityDistribution: CityCount[];
}

function startOfMonth(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function lastNDays(n: number): DayPoint[] {
  const out: DayPoint[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    out.push({
      date: iso,
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      value: 0,
    });
  }
  return out;
}

/** Bucket a list of ISO timestamps into a 30-day series (multiplying each by `weight`). */
function bucketByDay(timestamps: string[], weight = 1): DayPoint[] {
  const series = lastNDays(30);
  const index = new Map(series.map((p, i) => [p.date, i]));
  for (const ts of timestamps) {
    const day = ts.slice(0, 10);
    const i = index.get(day);
    if (i !== undefined) series[i].value += weight;
  }
  return series;
}

export interface RoleCount {
  role: string;
  count: number;
}

export interface UsersOverview {
  live: boolean; // true when backed by the real database
  activeUsers: number; // total registered users (the schema has no last-active field)
  signupTrend: DayPoint[]; // new profiles bucketed over the last 30 days
  roleBreakdown: RoleCount[]; // count per profiles.role, largest first
}

function countByRole(rows: { role: string | null }[]): RoleCount[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const role = r.role || "unknown";
    map.set(role, (map.get(role) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([role, count]) => ({ role, count }))
    .sort((a, b) => b.count - a.count);
}

function countByCity(rows: { city: string }[]): CityCount[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (!r.city) continue;
    map.set(r.city, (map.get(r.city) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);
}

/** Fallback overview computed from the bundled seed listings — used when Supabase isn't configured. */
function seedOverview(): AdminOverview {
  const now = Date.now();
  const listingTimestamps = seedListings.map((l) =>
    new Date(now - l.postedDaysAgo * 86_400_000).toISOString()
  );
  const monthStart = startOfMonth().getTime();
  const listingsThisMonth = seedListings.filter(
    (l) => now - l.postedDaysAgo * 86_400_000 >= monthStart
  ).length;

  const uniqueSellers = new Set(seedListings.map((l) => l.sellerName)).size;

  return {
    live: false,
    totals: {
      users: uniqueSellers,
      listings: seedListings.length,
      liveListings: seedListings.length,
      activeTransactions: 0,
      reveals: 0,
      revenue: 0,
    },
    thisMonth: { users: 0, listings: listingsThisMonth, reveals: 0 },
    series: {
      users: lastNDays(30),
      listings: bucketByDay(listingTimestamps),
      revenue: lastNDays(30),
    },
    cityDistribution: countByCity(seedListings),
  };
}

/**
 * Aggregate dashboard metrics from the real database via the service-role
 * client. Falls back to seed-derived figures when Supabase isn't configured or
 * a query fails, so the dashboard always renders.
 */
export async function getAdminOverview(): Promise<AdminOverview> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return seedOverview();
  }

  try {
    const monthStartIso = startOfMonth().toISOString();
    const thirtyDaysAgoIso = new Date(Date.now() - 30 * 86_400_000).toISOString();

    const [usersRes, listingsRes, revealsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("created_at"),
      supabaseAdmin.from("listings").select("created_at, city, status"),
      supabaseAdmin.from("contact_reveals").select("created_at, tier_used"),
    ]);

    if (usersRes.error || listingsRes.error || revealsRes.error) {
      return seedOverview();
    }

    const users = (usersRes.data ?? []) as { created_at: string }[];
    const listingRows = (listingsRes.data ?? []) as {
      created_at: string;
      city: string;
      status: string;
    }[];
    const reveals = (revealsRes.data ?? []) as { created_at: string; tier_used: string }[];

    const monthStartMs = new Date(monthStartIso).getTime();
    const isThisMonth = (ts: string) => new Date(ts).getTime() >= monthStartMs;
    const paidReveals = reveals.filter((r) => r.tier_used && r.tier_used !== "free");

    return {
      live: true,
      totals: {
        users: users.length,
        listings: listingRows.length,
        liveListings: listingRows.filter((l) => l.status === "live").length,
        activeTransactions: reveals.filter((r) => r.created_at >= thirtyDaysAgoIso).length,
        reveals: reveals.length,
        revenue: paidReveals.length * REVEAL_PRICE,
      },
      thisMonth: {
        users: users.filter((u) => isThisMonth(u.created_at)).length,
        listings: listingRows.filter((l) => isThisMonth(l.created_at)).length,
        reveals: reveals.filter((r) => isThisMonth(r.created_at)).length,
      },
      series: {
        users: bucketByDay(users.map((u) => u.created_at)),
        listings: bucketByDay(listingRows.map((l) => l.created_at)),
        revenue: bucketByDay(
          paidReveals.map((r) => r.created_at),
          REVEAL_PRICE
        ),
      },
      cityDistribution: countByCity(listingRows),
    };
  } catch {
    return seedOverview();
  }
}

/** Fallback users overview from seed data — used when Supabase isn't configured. */
function seedUsersOverview(): UsersOverview {
  const uniqueSellers = new Set(seedListings.map((l) => l.sellerName)).size;
  return {
    live: false,
    activeUsers: uniqueSellers,
    signupTrend: lastNDays(30), // no signup dates in seed data — empty 30-day frame
    roleBreakdown: [{ role: "seller", count: uniqueSellers }],
  };
}

/**
 * User-focused metrics for the admin Users page: total users, a 30-day signup
 * trend and the role distribution. Backed by `profiles`; falls back to
 * seed-derived figures (same policy as getAdminOverview) so the page always
 * renders.
 */
export async function getUsersOverview(): Promise<UsersOverview> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return seedUsersOverview();
  }

  try {
    const { data, error } = await supabaseAdmin.from("profiles").select("role, created_at");
    if (error) return seedUsersOverview();

    const rows = (data ?? []) as { role: string | null; created_at: string }[];
    return {
      live: true,
      activeUsers: rows.length,
      signupTrend: bucketByDay(rows.map((r) => r.created_at)),
      roleBreakdown: countByRole(rows),
    };
  } catch {
    return seedUsersOverview();
  }
}
