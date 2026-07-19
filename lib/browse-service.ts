import { supabase } from "@/lib/supabase";
import { Listing, listings as seedListings } from "@/lib/data";
import {
  PUBLIC_LISTING_COLUMNS,
  rowToListing,
  type ListingRow,
} from "@/lib/listings-service";

/** Filters the browse page understands. All optional — omitted means "any". */
export interface BrowseFilters {
  city?: string;
  plotType?: string;
  minPrice?: number; // in ₹ Lakh
  maxPrice?: number; // in ₹ Lakh
  minArea?: number; // in sqft
  maxArea?: number; // in sqft
}

export interface BrowsePage {
  listings: Listing[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const BROWSE_PAGE_SIZE = 12;

/** Sort orders the browse grid offers. `newest` is the default. */
export const BROWSE_SORTS = ["newest", "price-low", "price-high", "area-large"] as const;
export type SortOption = (typeof BROWSE_SORTS)[number];
export const DEFAULT_SORT: SortOption = "newest";

/** Comparator for the seed/in-memory path. */
function seedComparator(sort: SortOption): (a: Listing, b: Listing) => number {
  switch (sort) {
    case "price-low":
      return (a, b) => a.priceLakh - b.priceLakh;
    case "price-high":
      return (a, b) => b.priceLakh - a.priceLakh;
    case "area-large":
      return (a, b) => b.areaSqft - a.areaSqft;
    default:
      return (a, b) => a.postedDaysAgo - b.postedDaysAgo; // newest first
  }
}

/** Column + direction for the Supabase `.order()` clause. */
function sortToOrder(sort: SortOption): { column: string; ascending: boolean } {
  switch (sort) {
    case "price-low":
      return { column: "price_lakh", ascending: true };
    case "price-high":
      return { column: "price_lakh", ascending: false };
    case "area-large":
      return { column: "area_sqft", ascending: false };
    default:
      return { column: "created_at", ascending: false };
  }
}

export function hasActiveFilters(f: BrowseFilters): boolean {
  return Boolean(
    f.city || f.plotType || f.minPrice != null || f.maxPrice != null || f.minArea != null || f.maxArea != null
  );
}

/** Parse raw query params (from a URL or Next searchParams) into typed filters. */
export function parseBrowseFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): BrowseFilters {
  const get = (key: string): string | undefined => {
    if (params instanceof URLSearchParams) return params.get(key) ?? undefined;
    const v = params[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const num = (key: string): number | undefined => {
    const raw = get(key);
    if (raw == null || raw === "") return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  return {
    city: get("city") || undefined,
    plotType: get("type") || undefined,
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minArea: num("minArea"),
    maxArea: num("maxArea"),
  };
}

/** Parse the `sort` query param into a valid SortOption (defaults to newest). */
export function parseBrowseSort(
  params: URLSearchParams | Record<string, string | string[] | undefined>
): SortOption {
  const raw = params instanceof URLSearchParams ? params.get("sort") : params.sort;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return BROWSE_SORTS.includes(value as SortOption) ? (value as SortOption) : DEFAULT_SORT;
}

function applyFiltersToSeed(list: Listing[], f: BrowseFilters, sort: SortOption): Listing[] {
  return list
    .filter((l) => {
      if (f.city && l.city !== f.city) return false;
      if (f.plotType && l.plotType !== f.plotType) return false;
      if (f.minPrice != null && l.priceLakh < f.minPrice) return false;
      if (f.maxPrice != null && l.priceLakh > f.maxPrice) return false;
      if (f.minArea != null && l.areaSqft < f.minArea) return false;
      if (f.maxArea != null && l.areaSqft > f.maxArea) return false;
      return true;
    })
    .sort(seedComparator(sort));
}

function seedPage(
  filters: BrowseFilters,
  page: number,
  pageSize: number,
  sort: SortOption
): BrowsePage {
  const filtered = applyFiltersToSeed(seedListings, filters, sort);
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  return {
    listings: slice,
    total: filtered.length,
    page,
    pageSize,
    hasMore: start + slice.length < filtered.length,
  };
}

/**
 * Fetch one page of live listings matching `filters`, newest first.
 * Falls back to the bundled seed data when Supabase isn't configured, the
 * query errors, or the database has no live listings yet AND no filters are
 * applied (so the page isn't blank before real data exists). A filtered query
 * that legitimately matches nothing returns an empty page — the caller shows
 * the empty state.
 */
export async function getBrowsePage(
  filters: BrowseFilters,
  page = 1,
  pageSize = BROWSE_PAGE_SIZE,
  sort: SortOption = DEFAULT_SORT
): Promise<BrowsePage> {
  const safePage = Math.max(1, Math.floor(page) || 1);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedPage(filters, safePage, pageSize, sort);
  }

  try {
    let query = supabase
      .from("listings")
      .select(PUBLIC_LISTING_COLUMNS, { count: "exact" })
      .eq("status", "live");

    if (filters.city) query = query.eq("city", filters.city);
    if (filters.plotType) query = query.eq("plot_type", filters.plotType);
    if (filters.minPrice != null) query = query.gte("price_lakh", filters.minPrice);
    if (filters.maxPrice != null) query = query.lte("price_lakh", filters.maxPrice);
    if (filters.minArea != null) query = query.gte("area_sqft", filters.minArea);
    if (filters.maxArea != null) query = query.lte("area_sqft", filters.maxArea);

    const from = (safePage - 1) * pageSize;
    const to = from + pageSize - 1;

    const order = sortToOrder(sort);
    const { data, count, error } = await query
      .order(order.column, { ascending: order.ascending })
      .range(from, to);

    if (error || !data) {
      return seedPage(filters, safePage, pageSize, sort);
    }

    const total = count ?? data.length;

    // Database configured but empty of live listings and the visitor hasn't
    // filtered — show seed data so the page isn't blank pre-launch.
    if (total === 0 && !hasActiveFilters(filters)) {
      return seedPage(filters, safePage, pageSize, sort);
    }

    const listings = (data as unknown as ListingRow[]).map(rowToListing);
    return {
      listings,
      total,
      page: safePage,
      pageSize,
      hasMore: from + listings.length < total,
    };
  } catch {
    return seedPage(filters, safePage, pageSize, sort);
  }
}
