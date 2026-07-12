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

export async function getViewedPlotsCount(client: SupabaseClient, userId: string): Promise<number> {
  const { count } = await client
    .from("listing_views")
    .select("id", { count: "exact", head: true })
    .eq("viewer_id", userId);
  return count ?? 0;
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
  channel: string;
  status: string;
  message: string;
  createdAt: string;
}

export async function getUserInquiries(client: SupabaseClient, userId: string): Promise<InquiryEntry[]> {
  const { data } = await client
    .from("inquiries")
    .select("id, plot_id, channel, status, message, created_at")
    .eq("buyer_id", userId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const listings = await getListingsByIds([...new Set(rows.map((r) => r.plot_id as string))]);
  const titleById = new Map(listings.map((l) => [l.id, l.title]));

  return rows.map((r) => ({
    id: r.id as string,
    plotId: r.plot_id as string,
    plotTitle: titleById.get(r.plot_id as string) ?? "Plot",
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
