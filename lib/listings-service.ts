import { supabase } from "@/lib/supabase";
import { Listing, PlotType, listings as seedListings } from "@/lib/data";

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
  seller_name: string;
  seller_type: string;
  seller_phone: string;
  lat: number | null;
  lng: number | null;
  images: number;
  created_at: string;
  updated_at: string;
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
    sellerPhone: row.seller_phone,
    coordinates: { lat: Number(row.lat ?? 0), lng: Number(row.lng ?? 0) },
    images: row.images,
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
      .select("*")
      .eq("status", "live")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return seedListings;
    }

    return data.map(rowToListing);
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
      .select("*")
      .eq("id", id)
      .eq("status", "live")
      .maybeSingle();

    if (error || !data) {
      return seedListings.find((l) => l.id === id);
    }

    return rowToListing(data);
  } catch {
    return seedListings.find((l) => l.id === id);
  }
}
