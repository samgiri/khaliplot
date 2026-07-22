// Admin-assignable package catalog (see supabase/schema_part7_admin_packages.sql).
// `tier` is what actually drives access when mirrored onto profiles.subscription_tier
// (lib/listings-quota.ts / lib/dashboard-service.ts only check free vs not-free).
// `assignableToProfile` is false only for Reveal Pack: it's a top-up purchase,
// not a plan, so assigning one never overwrites the buyer's subscription_tier —
// it's logged in the Packages ledger only (real reveal-quota tracking is Part 5).

export interface PackageTypeDef {
  key: string;
  label: string;
  tier: "free" | "featured" | "boost" | "reveal_pack";
  defaultAmount: number;
  defaultDurationDays: number | null; // null = no natural expiry (Free)
  assignableToProfile: boolean;
}

export const PACKAGE_TYPES: PackageTypeDef[] = [
  { key: "free", label: "Free", tier: "free", defaultAmount: 0, defaultDurationDays: null, assignableToProfile: true },
  { key: "reveal_pack", label: "Reveal Pack", tier: "reveal_pack", defaultAmount: 499, defaultDurationDays: 90, assignableToProfile: false },
  { key: "plus_1m", label: "Plus 1M", tier: "featured", defaultAmount: 999, defaultDurationDays: 30, assignableToProfile: true },
  { key: "plus_100d", label: "Plus 100D", tier: "featured", defaultAmount: 2499, defaultDurationDays: 100, assignableToProfile: true },
  { key: "plus_yearly", label: "Plus Yearly", tier: "featured", defaultAmount: 5999, defaultDurationDays: 365, assignableToProfile: true },
  { key: "booster", label: "Booster", tier: "boost", defaultAmount: 499, defaultDurationDays: 7, assignableToProfile: true },
];

const BY_KEY = new Map(PACKAGE_TYPES.map((p) => [p.key, p]));

export function isPackageKey(value: unknown): value is string {
  return typeof value === "string" && BY_KEY.has(value);
}

export function getPackageType(key: string | null | undefined): PackageTypeDef | undefined {
  return key ? BY_KEY.get(key) : undefined;
}

/** Display label for a package row — falls back to a title-cased tier for
 * pre-Part-7 rows that predate package_key. */
export function packageLabel(packageKey: string | null | undefined, tier: string): string {
  const def = getPackageType(packageKey);
  if (def) return def.label;
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
