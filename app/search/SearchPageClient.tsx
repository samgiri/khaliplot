"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import PlotCard from "@/components/PlotCard";
import { cities, plotTypes, Listing } from "@/lib/data";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "area-large", label: "Area: Largest first" },
];

export default function SearchPageClient({
  initialListings,
  savedPlotIds = [],
}: {
  initialListings: Listing[];
  savedPlotIds?: string[];
}) {
  const searchParams = useSearchParams();
  const listings = initialListings;
  const savedSet = useMemo(() => new Set(savedPlotIds), [savedPlotIds]);

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [budget, setBudget] = useState(searchParams.get("budget") || "");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = listings.filter((l) => {
      if (city && l.city !== city) return false;
      if (type && l.plotType !== type) return false;
      if (budget && l.priceLakh > Number(budget)) return false;
      if (verifiedOnly && !l.verified) return false;
      return true;
    });

    switch (sort) {
      case "price-low":
        result = [...result].sort((a, b) => a.priceLakh - b.priceLakh);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.priceLakh - a.priceLakh);
        break;
      case "area-large":
        result = [...result].sort((a, b) => b.areaSqft - a.areaSqft);
        break;
      default:
        result = [...result].sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    }
    return result;
  }, [city, type, budget, verifiedOnly, sort]);

  const activeFilterCount = [city, type, budget, verifiedOnly].filter(Boolean).length;

  function clearFilters() {
    setCity("");
    setType("");
    setBudget("");
    setVerifiedOnly(false);
  }

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="coord-label mb-3 text-navy/60">City</h3>
        <div className="flex flex-wrap gap-2">
          {["", ...cities].map((c) => (
            <button
              key={c || "all"}
              onClick={() => setCity(c)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                city === c
                  ? "border-green bg-green text-paper"
                  : "border-line bg-white text-ink hover:border-green-bright"
              }`}
            >
              {c || "All cities"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="coord-label mb-3 text-navy/60">Plot type</h3>
        <div className="flex flex-wrap gap-2">
          {["", ...plotTypes].map((t) => (
            <button
              key={t || "all"}
              onClick={() => setType(t)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                type === t
                  ? "border-green bg-green text-paper"
                  : "border-line bg-white text-ink hover:border-green-bright"
              }`}
            >
              {t || "Any type"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="coord-label mb-3 text-navy/60">Max budget</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "Any" },
            { value: "50", label: "Under ₹50 L" },
            { value: "100", label: "Under ₹1 Cr" },
            { value: "200", label: "Under ₹2 Cr" },
            { value: "500", label: "Under ₹5 Cr" },
          ].map((b) => (
            <button
              key={b.value || "any"}
              onClick={() => setBudget(b.value)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                budget === b.value
                  ? "border-green bg-green text-paper"
                  : "border-line bg-white text-ink hover:border-green-bright"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="coord-label mb-3 text-navy/60">Trust</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="h-4 w-4 accent-green"
          />
          Verified listings only
        </label>
      </div>

      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-sm font-semibold text-amber-dark hover:text-navy"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy sm:text-3xl">
          {city ? `Plots in ${city}` : "All plots"}
          {type ? ` · ${type}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {filtered.length} plot{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="plot-border sticky top-24 rounded-lg bg-white p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display font-semibold text-navy">
              <SlidersHorizontal size={16} />
              Filters
            </h2>
            {FilterPanel}
          </div>
        </aside>

        {/* Mobile filter toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 font-semibold text-navy"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-green px-2 py-0.5 text-xs text-paper">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="flex-1 bg-navy/40"
              onClick={() => setFiltersOpen(false)}
              aria-hidden="true"
            />
            <div className="w-[85%] max-w-sm overflow-y-auto bg-paper p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display font-semibold text-navy">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={22} className="text-navy" />
                </button>
              </div>
              {FilterPanel}
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-6 w-full rounded-md bg-green py-2.5 font-semibold text-paper"
              >
                Show {filtered.length} plots
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div>
          <div className="mb-4 flex justify-end">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-green-bright"
              aria-label="Sort listings"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((listing) => (
                <PlotCard key={listing.id} listing={listing} isSaved={savedSet.has(listing.id)} />
              ))}
            </div>
          ) : (
            <div className="plot-border rounded-lg bg-white p-12 text-center">
              <p className="font-display text-lg font-semibold text-navy">No plots match these filters</p>
              <p className="mt-2 text-sm text-muted">
                Try widening your budget or removing the city filter.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-md bg-green px-5 py-2.5 font-semibold text-paper hover:bg-navy"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
