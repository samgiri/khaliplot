import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Listing, PlotType, listings as seedListings } from "@/lib/data";
import type { ListingDocuments } from "@/lib/listing-form-data";

// Columns safe to expose publicly. seller_phone is deliberately excluded —
// it's only readable via the service role key, and will only reach a buyer
// through the contact-reveal flow (quota-checked, server-side).
const PUBLIC_LISTING_COLUMNS =
  "id, title, plot_type, city, locality, state, area_sqft, price_lakh, " +
  "price_per_sqft, facing, road_width_ft, dimensions, zone, features, " +
  "description, verified, status, seller_id, seller_name, seller_type, lat, lng, " +
  "images, created_at, updated_at, maps_link, area_unit, area_value, " +
  "price_per_unit, ownership_type, transaction_type, na_status, documents, " +
  "corner_plot, boundary_wall, gated_layout, possession, photo_urls";

// Database row shape (snake_case, as stored in Supabase)
interface ListingRow {
  id: string;
  title: string;
  plot_type: string;
  city: string;
  locality: string;
  state: string;
  area_sqft: number;
  price_lakh: number;
  price_per_sqft: number;
  facing: string;
  road_width_ft: number;
  dimensions: string;
  zone: string;
  features: string[];
  description: string;
  verified: boolean;
  status: string;
  seller_id: string | null;
  seller_name: string;
  seller_type: string;
  lat: number | null;
  lng: number | null;
  images: number;
  created_at: string;
  updated_at: string;
  maps_link: string | null;
  area_unit: string | null;
  area_value: number | null;
  price_per_unit: number | null;
  ownership_type: string | null;
  transaction_type: string | null;
  na_status: string | null;
  documents: ListingDocuments | null;
  corner_plot: boolean | null;
  boundary_wall: boolean | null;
  gated_layout: boolean | null;
  possession: string | null;
  photo_urls: string[] | null;
}

function daysAgo(dateString: string): number {
  const diffMs = Date.now() - new Date(dateString).getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function rowToListing(row: ListingRow): Listing {
  return {
    id: row.id,
    title: row.title,
    plotType: row.plot_type as PlotType,
    city: row.city,
    locality: row.locality,
    state: row.state,
    areaSqft: Number(row.area_sqft),
    priceLakh: Number(row.price_lakh),
    pricePerSqft: Number(row.price_per_sqft),
    facing: row.facing,
    roadWidthFt: Number(row.road_width_ft),
    dimensions: row.dimensions,
    zone: row.zone,
    features: row.features ?? [],
    description: row.description,
    postedDaysAgo: daysAgo(row.created_at),
    verified: row.verified,
    sellerName: row.seller_name,
    sellerType: row.seller_type as Listing["sellerType"],
    // Withheld from the public payload — see PUBLIC_LISTING_COLUMNS above.
    sellerPhone: "",
    coordinates: { lat: Number(row.lat ?? 0), lng: Number(row.lng ?? 0) },
    images: row.images,
    sellerId: row.seller_id,
    status: row.status,
    mapsLink: row.maps_link,
    areaUnit: row.area_unit ?? "sqft",
    areaValue: row.area_value != null ? Number(row.area_value) : null,
    pricePerUnit: row.price_per_unit != null ? Number(row.price_per_unit) : null,
    ownershipType: row.ownership_type,
    transactionType: row.transaction_type,
    naStatus: row.na_status,
    documents: row.documents ?? {},
    cornerPlot: row.corner_plot,
    boundaryWall: row.boundary_wall,
    gatedLayout: row.gated_layout,
    possession: row.possession,
    photoUrls: row.photo_urls ?? [],
  };
}

/**
 * Fetch all "live" listings from Supabase. Falls back to the bundled seed
 * data if Supabase isn't configured or the query fails/returns nothing —
 * this keeps the site working even before the database has real listings.
 */
export async function getLiveListings(): Promise<Listing[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedListings;
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select(PUBLIC_LISTING_COLUMNS)
      .eq("status", "live")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return seedListings;
    }

    return (data as unknown as ListingRow[]).map(rowToListing);
  } catch {
    return seedListings;
  }
}

/**
 * Fetch a single live listing by id. Falls back to seed data lookup if the
 * database isn't configured, the row isn't found there, or status isn't live.
 */
export async function getLiveListingById(id: string): Promise<Listing | undefined> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedListings.find((l) => l.id === id);
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select(PUBLIC_LISTING_COLUMNS)
      .eq("id", id)
      .eq("status", "live")
      .maybeSingle();

    if (error || !data) {
      return seedListings.find((l) => l.id === id);
    }

    return rowToListing(data as unknown as ListingRow);
  } catch {
    return seedListings.find((l) => l.id === id);
  }
}

/**
 * Fetch listings by id, in whatever order Supabase returns them. Used by
 * the buyer dashboard to resolve saved_plots/inquiries/contact_reveals rows
 * (which only store plot_id) into displayable listings. Uses the public
 * anon client like getLiveListings — a listing that's no longer status =
 * 'live' (sold/removed) will simply be omitted, since RLS only allows
 * public reads of live rows; that's an acceptable, minor limitation rather
 * than a reason to touch listings RLS for this display-only feature.
 */
export async function getListingsByIds(ids: string[]): Promise<Listing[]> {
  if (ids.length === 0) return [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedListings.filter((l) => ids.includes(l.id));
  }

  try {
    const { data, error } = await supabase.from("listings").select(PUBLIC_LISTING_COLUMNS).in("id", ids);
    if (error || !data) return [];
    return (data as unknown as ListingRow[]).map(rowToListing);
  } catch {
    return [];
  }
}

/**
 * Fetch every listing owned by a seller, regardless of status — used by
 * /my-listings. Takes the caller's session-bound Supabase client so RLS
 * ("Sellers can view own listings regardless of status") applies; never
 * falls back to seed data since this is always account-scoped.
 */
export async function getSellerListings(
  client: SupabaseClient,
  sellerId: string
): Promise<Listing[]> {
  const { data, error } = await client
    .from("listings")
    .select(PUBLIC_LISTING_COLUMNS)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ListingRow[]).map(rowToListing);
}

/** Fetch one of the caller's own listings by id (any status) — used to prefill the edit form. */
export async function getSellerListingById(
  client: SupabaseClient,
  id: string,
  sellerId: string
): Promise<Listing | undefined> {
  const { data, error } = await client
    .from("listings")
    .select(PUBLIC_LISTING_COLUMNS)
    .eq("id", id)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (error || !data) return undefined;
  return rowToListing(data as unknown as ListingRow);
}

/** Count of the caller's own listings with status = 'live', for the free-tier quota check. */
export async function countActiveSellerListings(
  client: SupabaseClient,
  sellerId: string
): Promise<number> {
  const { count, error } = await client
    .from("listings")
    .select("id", { count: "exact", head: true })
    .eq("seller_id", sellerId)
    .eq("status", "live");

  if (error || count == null) return 0;
  return count;
}
