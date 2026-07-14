// Indian land-unit conversions. Every unit is defined by how many square feet
// it equals, so conversions route through sqft. Regional units (Guntha, Bigha,
// Marla, Katha, Gaj, Ground…) vary a little by district — these are the common
// reference values used across Indian property listings.

export interface LandUnit {
  key: string;
  label: string;
  sqft: number; // 1 unit = this many sqft
  region?: string;
}

export const LAND_UNITS: LandUnit[] = [
  { key: "sqft", label: "Sqft", sqft: 1 },
  { key: "sqm", label: "Sqm", sqft: 10.7639 },
  { key: "guntha", label: "Guntha", sqft: 1089, region: "Maharashtra" },
  { key: "bigha", label: "Bigha", sqft: 14400, region: "North India (avg)" },
  { key: "marla", label: "Marla", sqft: 272.25, region: "Punjab / Haryana" },
  { key: "katha", label: "Katha", sqft: 1620, region: "Bihar / UP" },
  { key: "gaj", label: "Gaj", sqft: 9, region: "Gujarat / North" },
  { key: "ground", label: "Ground", sqft: 2400, region: "South India" },
  { key: "acre", label: "Acre", sqft: 43560 },
  { key: "hectare", label: "Hectare", sqft: 107639 },
];

const UNIT_BY_KEY: Record<string, LandUnit> = Object.fromEntries(
  LAND_UNITS.map((u) => [u.key, u])
);

export interface Conversion {
  key: string;
  label: string;
  region?: string;
  value: number;
  formatted: string;
}

/** Human-friendly number: grouped thousands, up to 3 decimals, no trailing zeros. */
export function formatUnitValue(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "0";
  // Keep more precision for small fractional results (e.g. 0.046 Acre).
  const maximumFractionDigits = n < 1 ? 4 : n < 100 ? 3 : 2;
  return n.toLocaleString("en-IN", { maximumFractionDigits });
}

/** Convert a value in `fromKey` units to every supported unit. */
export function convertAll(value: number, fromKey: string): Conversion[] {
  const from = UNIT_BY_KEY[fromKey];
  if (!from || !Number.isFinite(value)) return [];
  const sqft = value * from.sqft;
  return LAND_UNITS.map((unit) => {
    const converted = sqft / unit.sqft;
    return {
      key: unit.key,
      label: unit.label,
      region: unit.region,
      value: converted,
      formatted: formatUnitValue(converted),
    };
  });
}
