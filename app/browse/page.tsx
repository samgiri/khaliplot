import BrowseClient from "./BrowseClient";
import type { FilterValues } from "@/components/FilterBar";
import { BROWSE_PAGE_SIZE, getBrowsePage, parseBrowseFilters } from "@/lib/browse-service";
import { getCurrentUserSavedPlotIds } from "@/lib/dashboard-service";

export const revalidate = 60;

export const metadata = {
  title: "Browse Plots | KhaliPlot.in",
  description: "Browse verified plots and land for sale across India. Filter by city, type, budget and area.",
};

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const filters = parseBrowseFilters(params);

  const [first, savedPlotIds] = await Promise.all([
    getBrowsePage(filters, 1, BROWSE_PAGE_SIZE),
    getCurrentUserSavedPlotIds(),
  ]);

  const initialValues: FilterValues = {
    city: filters.city ?? "",
    plotType: filters.plotType ?? "",
    minPrice: filters.minPrice != null ? String(filters.minPrice) : "",
    maxPrice: filters.maxPrice != null ? String(filters.maxPrice) : "",
    minArea: filters.minArea != null ? String(filters.minArea) : "",
    maxArea: filters.maxArea != null ? String(filters.maxArea) : "",
  };

  return (
    <BrowseClient
      initialPage={first}
      savedPlotIds={[...savedPlotIds]}
      initialValues={initialValues}
    />
  );
}
