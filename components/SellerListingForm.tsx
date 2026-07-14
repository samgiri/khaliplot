"use client";

import type { Listing } from "@/lib/data";
import PostPlotForm from "@/app/post-plot/PostPlotForm";

/**
 * Seller-dashboard wrapper around the canonical listing form. All field
 * logic (location hierarchy, units, photos, AI description, validation)
 * lives in PostPlotForm — this only points the post-submit redirect back
 * at /seller/dashboard instead of /my-listings, so the two entry points
 * never drift apart.
 */
export default function SellerListingForm({
  editingId,
  initial,
  localitySuggestions = [],
}: {
  editingId?: string;
  initial?: Listing | null;
  localitySuggestions?: { city: string; locality: string }[];
}) {
  return (
    <PostPlotForm
      editingId={editingId}
      initial={initial}
      localitySuggestions={localitySuggestions}
      redirectTo={editingId ? "/seller/dashboard?updated=1" : "/seller/dashboard?posted=1"}
    />
  );
}
