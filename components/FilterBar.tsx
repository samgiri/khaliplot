"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cities, plotTypes } from "@/lib/data";

export interface FilterValues {
  city: string;
  plotType: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
}

export const EMPTY_FILTERS: FilterValues = {
  city: "",
  plotType: "",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
};

interface FilterBarProps {
  values: FilterValues;
  onChange: (field: keyof FilterValues, value: string) => void;
  onApply: () => void;
  onClear: () => void;
  activeCount: number;
  resultCount: number;
  loading?: boolean;
}

// The actual controls, shared between the desktop bar and the mobile drawer.
// `idPrefix` keeps the two rendered instances' element ids unique.
function Controls({
  values,
  onChange,
  idPrefix,
}: {
  values: FilterValues;
  onChange: FilterBarProps["onChange"];
  idPrefix: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-city`} className="coord-label text-navy/60">
          City
        </label>
        <select
          id={`${idPrefix}-city`}
          value={values.city}
          onChange={(e) => onChange("city", e.target.value)}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-green-bright"
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${idPrefix}-type`} className="coord-label text-navy/60">
          Plot type
        </label>
        <select
          id={`${idPrefix}-type`}
          value={values.plotType}
          onChange={(e) => onChange("plotType", e.target.value)}
          className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-green-bright"
        >
          <option value="">Any type</option>
          {plotTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="coord-label text-navy/60">Budget (₹ Lakh)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label="Minimum budget in lakh"
            placeholder="Min"
            value={values.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:border-green-bright"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label="Maximum budget in lakh"
            placeholder="Max"
            value={values.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:border-green-bright"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="coord-label text-navy/60">Area (sqft)</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label="Minimum area in sqft"
            placeholder="Min"
            value={values.minArea}
            onChange={(e) => onChange("minArea", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:border-green-bright"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label="Maximum area in sqft"
            placeholder="Max"
            value={values.maxArea}
            onChange={(e) => onChange("maxArea", e.target.value)}
            className="w-full rounded-md border border-line bg-white px-2.5 py-2 text-sm focus:border-green-bright"
          />
        </div>
      </div>
    </>
  );
}

export default function FilterBar({
  values,
  onChange,
  onApply,
  onClear,
  activeCount,
  resultCount,
  loading = false,
}: FilterBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="sticky top-16 z-30 border-y border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-5 py-3 sm:px-8">
        {/* Desktop: inline filter bar */}
        <div className="hidden items-end gap-3 lg:flex">
          <div className="grid flex-1 grid-cols-4 gap-3">
            <Controls values={values} onChange={onChange} idPrefix="d" />
          </div>
          <button
            onClick={onApply}
            disabled={loading}
            className="rounded-md bg-amber px-5 py-2 font-display font-bold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60"
          >
            Apply
          </button>
          <button
            onClick={onClear}
            disabled={activeCount === 0}
            className="rounded-md border border-line bg-white px-4 py-2 font-semibold text-navy transition-colors hover:border-navy disabled:opacity-40"
          >
            Clear
          </button>
        </div>

        {/* Mobile: compact bar with a drawer trigger */}
        <div className="flex items-center justify-between lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2 font-semibold text-navy"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-green px-2 py-0.5 text-xs text-paper">{activeCount}</span>
            )}
          </button>
          <p className="text-sm text-muted">
            {resultCount} plot{resultCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="flex-1 bg-navy/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="flex w-[88%] max-w-sm flex-col overflow-y-auto bg-paper p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-navy">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close filters">
                <X size={22} className="text-navy" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <Controls values={values} onChange={onChange} idPrefix="m" />
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  onApply();
                  setDrawerOpen(false);
                }}
                disabled={loading}
                className="w-full rounded-md bg-amber py-2.5 font-display font-bold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60"
              >
                Show {resultCount} plot{resultCount !== 1 ? "s" : ""}
              </button>
              <button
                onClick={onClear}
                disabled={activeCount === 0}
                className="w-full rounded-md border border-line bg-white py-2.5 font-semibold text-navy disabled:opacity-40"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
