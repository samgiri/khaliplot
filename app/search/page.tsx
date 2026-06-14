import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata = {
  title: "Browse Plots | KhaliPlot.in",
  description: "Browse verified plots and land for sale across Lonavla, Pune and Nashik.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">Loading…</div>}>
      <SearchPageClient />
    </Suspense>
  );
}
