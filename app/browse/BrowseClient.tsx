"use client";

import { useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import PlotCard from "@/components/PlotCard";
import FilterBar, { EMPTY_FILTERS, type FilterValues } from "@/components/FilterBar";
import UnitConverterButton from "@/components/UnitConverterModal";
import type { BrowsePage, SortOption } from "@/lib/browse-service";
import type { Listing } from "@/lib/data";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "area-large", label: "Area: Largest first" },
];

function buildQuery(f: FilterValues, page: number, sort: SortOption): string {
  const p = new URLSearchParams();
  if (f.city) p.set("city", f.city);
  if (f.plotType) p.set("type", f.plotType);
  if (f.minPrice) p.set("minPrice", f.minPrice);
  if (f.maxPrice) p.set("maxPrice", f.maxPrice);
  if (f.minArea) p.set("minArea", f.minArea);
  if (f.maxArea) p.set("maxArea", f.maxArea);
  if (sort !== "newest") p.set("sort", sort);
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
  initialSort,
}: {
  initialPage: BrowsePage;
  savedPlotIds: string[];
  initialValues: FilterValues;
  initialSort: SortOption;
}) {
  const savedSet = useMemo(() => new Set(savedPlotIds), [savedPlotIds]);

  // `draft` is what the inputs show; `applied` is what the current results
  // reflect (also what Load More pages through).
  const [draft, setDraft] = useState<FilterValues>(initialValues);
  const [applied, setApplied] = useState<FilterValues>(initialValues);
  const [sort, setSort] = useState<SortOption>(initialSort);

  const [listings, setListings] = useState<Listing[]>(initialPage.listings);
  const [total, setTotal] = useState(initialPage.total);
  const [hasMore, setHasMore] = useState(initialPage.hasMore);
  const [page, setPage] = useState(initialPage.page);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Guards against rapid repeat taps on the Apply/Filters button (common on
  // touch devices, where a double-tap can fire two click events before the
  // button's `disabled` state re-renders).
  const lastApplyRef = useRef(0);
  // Tags each fetch so a slower, earlier response can never overwrite a
  // faster, later one — without this, out-of-order responses could make the
  // first click's request appear to have been silently dropped.
  const requestIdRef = useRef(0);

  function onChange(field: keyof FilterValues, value: string) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  async function fetchFirstPage(filters: FilterValues, sortValue: SortOption) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    const qs = buildQuery(filters, 1, sortValue);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/browse${qs ? `?${qs}` : ""}`);
    }
    try {
      const res = await fetch(`/api/browse${qs ? `?${qs}` : ""}`);
      const data: BrowsePage = await res.json();
      if (requestIdRef.current !== requestId) return; // superseded by a newer request
      setListings(data.listings);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(1);
    } catch {
      // Keep the previous results on a network hiccup rather than blanking out.
    } finally {
      if (requestIdRef.current === requestId) setLoading(false);
    }
  }

  function applyFilters() {
    const now = Date.now();
    if (now - lastApplyRef.current < 400) return; // debounce rapid repeat taps
    lastApplyRef.current = now;
    setApplied(draft);
    fetchFirstPage(draft, sort);
  }

  function clearFilters() {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    fetchFirstPage(EMPTY_FILTERS, sort); // clearing filters keeps the chosen sort
  }

  function changeSort(next: SortOption) {
    setSort(next);
    fetchFirstPage(applied, next); // re-sort the applied result set from page 1
  }

  async function loadMore() {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/browse?${buildQuery(applied, next, sort)}`);
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
        {/* Info banner */}
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-line bg-green-pale p-4 sm:flex-row sm:items-center">
          <p className="text-sm text-navy">
            <span className="font-semibold">Browse free.</span> Ready to talk to a seller? Reveal
            contact for <span className="font-semibold">₹499</span> — or go unlimited with Plus.
          </p>
          <a
            href="/pricing"
            className="shrink-0 rounded-md bg-amber px-4 py-2 text-sm font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            See pricing
          </a>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">Browse plots</h1>
            <p className="mt-1 text-sm text-muted">
              {total} plot{total !== 1 ? "s" : ""} available
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="browse-sort" className="coord-label shrink-0 text-navy/60">
                Sort
              </label>
              <select
                id="browse-sort"
                value={sort}
                onChange={(e) => changeSort(e.target.value as SortOption)}
                disabled={loading}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-green-bright disabled:opacity-60"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <UnitConverterButton />
          </div>
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
