import { NextRequest, NextResponse } from "next/server";
import { BROWSE_PAGE_SIZE, getBrowsePage, parseBrowseFilters } from "@/lib/browse-service";

// Load-more endpoint for the browse grid. Reads the same filter params the
// page does, plus `page`, and returns a JSON BrowsePage.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const filters = parseBrowseFilters(params);
  const page = Number(params.get("page") || "1") || 1;

  const result = await getBrowsePage(filters, page, BROWSE_PAGE_SIZE);
  return NextResponse.json(result);
}
