import type { SupabaseClient } from "@supabase/supabase-js";
import { getListingsByIds } from "@/lib/listings-service";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { Listing } from "@/lib/data";

export async function getSavedPlotIds(client: SupabaseClient, userId: string): Promise<Set<string>> {
  const { data } = await client.from("saved_plots").select("plot_id").eq("buyer_id", userId);
  return new Set((data ?? []).map((r) => r.plot_id as string));
}

/**
 * Self-contained variant for pages that just need to know which plots the
 * current visitor has saved (to render filled/outline hearts) without
 * caring who they are otherwise. Returns an empty set when logged out or
 * Supabase isn't configured — never throws.
 */
export async function getCurrentUserSavedPlotIds(): Promise<Set<string>> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return new Set();

  try {
    const client = await createSupabaseServerClient();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return new Set();
    return getSavedPlotIds(client, user.id);
  } catch {
    return new Set();
  }
}

export interface SavedPlotEntry {
  listing: Listing;
  savedAt: string;
}

export async function getSavedPlots(client: SupabaseClient, userId: string): Promise<SavedPlotEntry[]> {
  const { data } = await client
    .from("saved_plots")
    .select("plot_id, created_at")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const listings = await getListingsByIds(rows.map((r) => r.plot_id as string));
  const byId = new Map(listings.map((l) => [l.id, l]));

  return rows
    .map((r) => ({ listing: byId.get(r.plot_id as string), savedAt: r.created_at as string }))
    .filter((entry): entry is SavedPlotEntry => Boolean(entry.listing));
}

/** Fire-and-forget: records that a signed-in user viewed a plot. Never throws. */
export async function recordListingView(
  client: SupabaseClient,
  userId: string,
  plotId: string
): Promise<void> {
  try {
    await client
      .from("listing_views")
      .upsert({ viewer_id: userId, plot_id: plotId }, { onConflict: "viewer_id,plot_id", ignoreDuplicates: true });
  } catch {
    // best-effort analytics — never blocks the page
  }
}

export interface InquiryEntry {
  id: string;
  plotId: string;
  plotTitle: string;
  sellerName: string | null;
  channel: string;
  status: string;
  message: string;
  createdAt: string;
}

export async function getUserInquiries(client: SupabaseClient, userId: string): Promise<InquiryEntry[]> {
  const { data } = await client
    .from("inquiries")
    .select("id, plot_id, seller_id, channel, status, message, created_at")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const listings = await getListingsByIds([...new Set(rows.map((r) => r.plot_id as string))]);
  const titleById = new Map(listings.map((l) => [l.id, l.title]));

  const sellerIds = [...new Set(rows.map((r) => r.seller_id as string))];
  const { data: sellers } = await client.from("profiles").select("id, name").in("id", sellerIds);
  const sellerNameById = new Map(
    (sellers ?? []).map((s) => [s.id as string, s.name as string | null])
  );

  return rows.map((r) => ({
    id: r.id as string,
    plotId: r.plot_id as string,
    plotTitle: titleById.get(r.plot_id as string) ?? "Plot",
    sellerName: sellerNameById.get(r.seller_id as string) ?? null,
    channel: r.channel as string,
    status: r.status as string,
    message: r.message as string,
    createdAt: r.created_at as string,
  }));
}

export interface RevealEntry {
  id: string;
  plotId: string;
  plotTitle: string;
  tierUsed: string;
  createdAt: string;
}

export async function getUserReveals(client: SupabaseClient, userId: string): Promise<RevealEntry[]> {
  const { data } = await client
    .from("contact_reveals")
    .select("id, plot_id, tier_used, created_at")
    .eq("viewer_id", userId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const listings = await getListingsByIds([...new Set(rows.map((r) => r.plot_id as string))]);
  const titleById = new Map(listings.map((l) => [l.id, l.title]));

  return rows.map((r) => ({
    id: r.id as string,
    plotId: r.plot_id as string,
    plotTitle: titleById.get(r.plot_id as string) ?? "Plot",
    tierUsed: r.tier_used as string,
    createdAt: r.created_at as string,
  }));
}

/** Count of reveals used since the 1st of the current calendar month. */
export async function getMonthlyRevealCount(client: SupabaseClient, userId: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await client
    .from("contact_reveals")
    .select("id", { count: "exact", head: true })
    .eq("viewer_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  return count ?? 0;
}

/** Free tier: 1 reveal/month (per /pricing). Any other subscription_tier: unlimited (Plus). */
export function getMonthlyRevealQuota(subscriptionTier: string | null | undefined): number | null {
  if (subscriptionTier && subscriptionTier !== "free") return null; // null = unlimited
  return 1;
}

export interface CurrentPackage {
  tier: string;
  packageKey: string | null;
  expiresAt: string | null;
  status: string;
}

/**
 * The buyer's current package for the dashboard's status card — the latest
 * non-cancelled subscriptions row, same "current package" definition used by
 * the admin Extend/Cancel actions (app/api/admin/packages/route.ts). Reads
 * package_key (not just tier) so e.g. "Plus 100D" vs "Plus Yearly" display
 * correctly. RLS already scopes this to the caller's own rows.
 */
export async function getCurrentPackage(
  client: SupabaseClient,
  userId: string
): Promise<CurrentPackage | null> {
  const { data } = await client
    .from("subscriptions")
    .select("tier, package_key, expires_at, status")
    .eq("user_id", userId)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    tier: data.tier as string,
    packageKey: data.package_key as string | null,
    expiresAt: data.expires_at as string | null,
    status: data.status as string,
  };
}
