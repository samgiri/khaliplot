// State -> Region (metro area) hierarchy for the post-plot form.
//
// "Region" values are stored in the existing listings.city column, so every
// value here must stay in sync with lib/data.ts `cities` (which powers the
// search filters and quick-search dropdown). The brief specified Delhi,
// Maharashtra, Karnataka, Telangana and Rajasthan; the extra states/regions
// below cover every market that already has live listings (Gurgaon, Noida,
// Neemrana, Lonavla, Nashik, Dholera, Goa) so none of them becomes
// un-postable when the free-text "Other" city option goes away.
export const STATE_REGIONS: Record<string, string[]> = {
  Delhi: ["Delhi NCR"],
  Haryana: ["Gurgaon"],
  "Uttar Pradesh": ["Noida"],
  Rajasthan: ["Jaipur", "Neemrana"],
  Maharashtra: ["Mumbai", "Navi Mumbai", "Pune", "Lonavla", "Nashik"],
  Gujarat: ["Dholera"],
  Karnataka: ["Bengaluru"],
  Telangana: ["Hyderabad"],
  Goa: ["Goa"],
};

export const LOCATION_STATES = Object.keys(STATE_REGIONS);

export function getRegionsForState(state: string | null | undefined): string[] {
  if (!state) return [];
  return STATE_REGIONS[state] ?? [];
}

/** Reverse lookup for edit-prefill: which state does a stored city/region belong to? */
export function findStateForRegion(region: string | null | undefined): string | undefined {
  if (!region) return undefined;
  return LOCATION_STATES.find((state) => STATE_REGIONS[state].includes(region));
}
