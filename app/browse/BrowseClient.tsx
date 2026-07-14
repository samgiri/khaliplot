"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import PlotCard from "@/components/PlotCard";
import FilterBar, { EMPTY_FILTERS, type FilterValues } from "@/components/FilterBar";
import UnitConverterButton from "@/components/UnitConverterModal";
import type { BrowsePage } from "@/lib/browse-service";
import type { Listing } from "@/lib/data";

function buildQuery(f: FilterValues, page: number): string {
  const p = new URLSearchParams();
  if (f.city) p.set("city", f.city);
  if (f.plotType) p.set("type", f.plotType);
  if (f.minPrice) p.set("minPrice", f.minPrice);
  if (f.maxPrice) p.set("maxPrice", f.maxPrice);
  if (f.minArea) p.set("minArea", f.minArea);
  if (f.maxArea) p.set("maxArea", f.maxArea);
  if (page > 1) p.set("page", String(page));
  return p.toString();
}

function countActive(f: FilterValues): number {
  return Object.values(f).filter((v) => v !== "").length;
}

function SkeletonCard() {
  return (
    <div className="plot-border overflow-hidden rounded-lg bg-white">
      <div className="aspect-video animate-pulse bg-paper-dim" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-paper-dim" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-paper-dim" />
        <div className="plot-divider my-1" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-paper-dim" />
      </div>
    </div>
  );
}

export default function BrowseClient({
  initialPage,
  savedPlotIds,
  initialValues,
}: {
  initialPage: BrowsePage;
  savedPlotIds: string[];
  initialValues: FilterValues;
}) {
  const savedSet = useMemo(() => new Set(savedPlotIds), [savedPlotIds]);

  // `draft` is what the inputs show; `applied` is what the current results
  // reflect (also what Load More pages through).
  const [draft, setDraft] = useState<FilterValues>(initialValues);
  const [applied, setApplied] = useState<FilterValues>(initialValues);

  const [listings, setListings] = useState<Listing[]>(initialPage.listings);
  const [total, setTotal] = useState(initialPage.total);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [page, setPage] = useState(initialPage.page);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  function onChange(field: keyof FilterValues, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchFirstPage(filters: FilterValues) {
    setLoading(true);
    const qs = buildQuery(filters, 1);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/browse${qs ? `?${qs}` : ""}`);
    }
    try {
      const res = await fetch(`/api/browse${qs ? `?${qs}` : ""}`);
      const data: BrowsePage = await res.json();
      setListings(data.listings);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch {
      // Keep the previous results on a network hiccup rather than blanking out.
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    setApplied(draft);
    fetchFirstPage(draft);
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    fetchFirstPage(EMPTY_FILTERS);
  }

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/browse?${buildQuery(applied, next)}`);
      const data: BrowsePage = await res.json();
      setListings((prev) => [...prev, ...data.listings]);
      setHasMore(data.hasMore);
      setPage(next);
    } catch {
      // Leave the grid as-is; the Load More button stays available to retry.
    } finally {
      setLoadingMore(false);
    }
  }

  const activeCount = countActive(draft);

  return (
    <div>
      <FilterBar
        values={draft}
        onChange={onChange}
        onApply={applyFilters}
        onClear={clearFilters}
        activeCount={activeCount}
        resultCount={total}
        loading={loading}
      />

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Browse plots</h1>
            <p className="mt-1 text-sm text-muted">
              {total} plot{total !== 1 ? "s" : ""} available
            </p>
          </div>
          <UnitConverterButton />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <PlotCard key={listing.id} listing={listing} isSaved={savedSet.has(listing.id)} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-md border-2 border-navy bg-white px-6 py-3 font-display font-bold text-navy transition-colors hover:bg-navy hover:text-paper disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Loading…
                    </>
                  ) : (
                    "Load more plots"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="plot-border mx-auto max-w-md rounded-lg bg-white p-12 text-center">
            <p className="font-display text-lg font-bold text-navy">No plots found matching your filters</p>
            <p className="mt-2 text-sm text-muted">Try adjusting your search.</p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-md bg-amber px-5 py-2.5 font-display font-bold text-navy transition-colors hover:bg-amber-dark"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
