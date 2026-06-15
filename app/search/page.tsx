import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";
import { getLiveListings } from "@/lib/listings-service";

export const revalidate = 60;

export const metadata = {
  title: "Browse Plots | KhaliPlot.in",
  description: "Browse verified plots and land for sale across India.",
};

export default async function SearchPage() {
  const listings = await getLiveListings();

  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">Loading…</div>}>
      <SearchPageClient initialListings={listings} />
    </Suspense>
  );
}
