import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export interface SellerLead {
  id: string;
  plotId: string;
  plotTitle: string;
  buyerName: string;
  channel: string;
  message: string;
  status: string;
  createdAt: string;
}

/**
 * Fetch every inquiry addressed to a seller, newest first — used by
 * /seller/leads. Takes the caller's session-bound Supabase client so RLS
 * ("Sellers view inquiries addressed to them") applies. Plot titles come
 * from the seller's own listings (readable regardless of status); buyer
 * names are resolved server-side via the admin client since profiles are
 * only self-readable under RLS — only the name is exposed, never contact
 * details, which stay behind the reveal flow.
 */
export async function getSellerLeads(client: SupabaseClient, sellerId: string): Promise<SellerLead[]> {
  const { data } = await client
    .from("inquiries")
    .select("id, plot_id, buyer_id, channel, status, message, created_at")
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  const rows = data ?? [];
  if (rows.length === 0) return [];

  const plotIds = [...new Set(rows.map((r) => r.plot_id as string))];
  const { data: plots } = await client
    .from("listings")
    .select("id, title")
    .eq("seller_id", sellerId)
    .in("id", plotIds);
  const titleById = new Map((plots ?? []).map((p) => [p.id as string, p.title as string]));

  const buyerIds = [...new Set(rows.map((r) => r.buyer_id as string))];
  const nameById = new Map<string, string>();
  try {
    const { data: buyers } = await supabaseAdmin.from("profiles").select("id, name").in("id", buyerIds);
    for (const b of buyers ?? []) {
      if (b.name) nameById.set(b.id as string, b.name as string);
    }
  } catch {
    // Admin client not configured — leads still render with a generic name.
  }

  return rows.map((r) => ({
    id: r.id as string,
    plotId: r.plot_id as string,
    plotTitle: titleById.get(r.plot_id as string) ?? "Plot",
    buyerName: nameById.get(r.buyer_id as string) ?? "A buyer",
    channel: r.channel as string,
    message: r.message as string,
    status: r.status as string,
    createdAt: r.created_at as string,
  }));
}

/**
 * Distinct signed-in viewers per listing, for the seller dashboard's view
 * stats. listing_views RLS only lets viewers read their own rows, so this
 * goes through the admin client — safe because it only ever returns
 * aggregate counts for the seller's own listing ids, computed server-side.
 * Returns an empty map when the admin client isn't configured.
 */
export async function getListingViewCounts(listingIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (listingIds.length === 0) return counts;

  try {
    const { data } = await supabaseAdmin.from("listing_views").select("plot_id").in("plot_id", listingIds);
    for (const row of data ?? []) {
      const id = row.plot_id as string;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  } catch {
    // Admin client not configured — dashboard shows 0 views rather than erroring.
  }
  return counts;
}
