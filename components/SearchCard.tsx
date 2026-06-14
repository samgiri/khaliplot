"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { cities, plotTypes } from "@/lib/data";

export default function SearchCard() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [plotType, setPlotType] = useState("");
  const [budget, setBudget] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (plotType) params.set("type", plotType);
    if (budget) params.set("budget", budget);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full rounded-xl border-2 border-navy bg-paper p-5 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-6"
    >
      <p className="coord-label mb-4 text-navy/60">Find your plot</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-semibold text-navy">
            City
          </label>
          <div className="relative">
            <MapPin
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-md border border-line bg-white py-2.5 pl-10 pr-3 text-sm text-ink focus:border-green-bright"
            >
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="plotType" className="text-sm font-semibold text-navy">
            Plot type
          </label>
          <select
            id="plotType"
            value={plotType}
            onChange={(e) => setPlotType(e.target.value)}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
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
          <label htmlFor="budget" className="text-sm font-semibold text-navy">
            Max budget
          </label>
          <select
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-green-bright"
          >
            <option value="">Any budget</option>
            <option value="50">Under ₹50 Lakh</option>
            <option value="100">Under ₹1 Cr</option>
            <option value="500">Under ₹5 Cr</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-green px-6 py-3 font-semibold text-paper transition-colors hover:bg-navy sm:w-auto"
      >
        <Search size={18} />
        Search plots
      </button>
    </form>
  );
}
