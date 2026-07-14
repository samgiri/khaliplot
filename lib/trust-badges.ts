import type { Listing } from "@/lib/data";
import { getLandRecordLabel } from "@/lib/land-records";

// Trust signals Indian buyers check first. Derived from fields the listing
// already carries — no extra DB columns required.
export type TrustTone = "rera" | "record-712" | "record-other" | "verified" | "owner";

export interface TrustBadge {
  key: string;
  label: string;
  tone: TrustTone;
}

/**
 * Build the ordered list of trust badges for a listing:
 *  - RERA Verified   ← documents.rera_registered
 *  - 7/12 Ready      ← documents.land_record in a 7/12 (Satbara) state
 *  - <record> Ready  ← documents.land_record elsewhere (e.g. Jamabandi)
 *  - Verified Seller ← listing.verified
 *  - Direct Owner    ← seller_type = 'Owner'
 */
export function deriveTrustBadges(listing: Listing): TrustBadge[] {
  const badges: TrustBadge[] = [];
  const docs = listing.documents ?? {};

  if (docs.rera_registered) {
    badges.push({ key: "rera", label: "RERA Verified", tone: "rera" });
  }

  if (docs.land_record) {
    const recordLabel = getLandRecordLabel(listing.state);
    if (recordLabel.includes("7/12")) {
      badges.push({ key: "record-712", label: "7/12 Ready", tone: "record-712" });
    } else {
      badges.push({ key: "record", label: `${recordLabel} Ready`, tone: "record-other" });
    }
  }

  if (listing.verified) {
    badges.push({ key: "verified", label: "Verified Seller", tone: "verified" });
  }

  if (listing.sellerType === "Owner") {
    badges.push({ key: "owner", label: "Direct Owner", tone: "owner" });
  }

  return badges;
}
