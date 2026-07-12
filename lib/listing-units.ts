export const AREA_UNITS = [
  { value: "sqft", label: "sq ft" },
  { value: "sqm", label: "sq m" },
  { value: "sqyd", label: "sq yd (gaj)" },
  { value: "guntha", label: "guntha" },
  { value: "acre", label: "acre" },
  { value: "hectare", label: "hectare" },
] as const;

export type AreaUnit = (typeof AREA_UNITS)[number]["value"];

// Conversion factor to sq ft, per the portal-standard set.
const TO_SQFT: Record<AreaUnit, number> = {
  sqft: 1,
  sqm: 10.764,
  sqyd: 9,
  guntha: 1089,
  acre: 43560,
  hectare: 107639,
};

export function toSqft(value: number, unit: AreaUnit): number {
  return value * TO_SQFT[unit];
}

export function unitLabel(unit: AreaUnit): string {
  return AREA_UNITS.find((u) => u.value === unit)?.label ?? unit;
}

export function formatIndianRupees(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}
