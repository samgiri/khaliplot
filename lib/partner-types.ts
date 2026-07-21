// Partner Type taxonomy for strategic partner onboarding (dealers,
// influencers, consultants, brand ambassadors) — see
// supabase/schema_part6_partner_packages.sql for the matching DB constraints
// on profiles.partner_type and subscriptions.partner_type.

export const PARTNER_TYPES = [
  "influencer",
  "dealer",
  "consultant",
  "brand_ambassador",
  "other",
] as const;

export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  influencer: "Influencer",
  dealer: "Dealer",
  consultant: "Consultant",
  brand_ambassador: "Brand Ambassador",
  other: "Other",
};

export function isPartnerType(value: unknown): value is PartnerType {
  return typeof value === "string" && (PARTNER_TYPES as readonly string[]).includes(value);
}
