import { toSqft, AREA_UNITS, type AreaUnit } from "@/lib/listing-units";
import { plotTypes } from "@/lib/data";
import {
  OWNERSHIP_TYPES,
  TRANSACTION_TYPES,
  NA_STATUS_OPTIONS,
  sanitizeDocuments,
  type ListingDocuments,
} from "@/lib/listing-form-data";

const AREA_UNIT_VALUES = AREA_UNITS.map((u) => u.value) as string[];

export interface ParsedListingFields {
  title: string;
  plot_type: string;
  city: string;
  locality: string;
  state: string;
  area_sqft: number;
  area_unit: AreaUnit;
  area_value: number;
  price_lakh: number;
  price_per_sqft: number;
  price_per_unit: number;
  facing: string;
  road_width_ft: number;
  description: string;
  maps_link: string | null;
  ownership_type: string | null;
  transaction_type: string | null;
  na_status: string | null;
  documents: ListingDocuments;
  corner_plot: boolean | null;
  boundary_wall: boolean | null;
  gated_layout: boolean | null;
  possession: string | null;
  photo_urls: string[];
  images: number;
}

/** Validates and normalizes a post-plot form payload. Returns an error string, or the parsed fields. */
export function parseListingFields(
  body: Record<string, unknown>
): { error: string } | { value: ParsedListingFields } {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 80) {
    return { error: "Title is required (max 80 characters)." };
  }

  const plotType = (plotTypes as string[]).includes(body.plotType as string)
    ? (body.plotType as string)
    : "";
  if (!plotType) {
    return { error: "Please select a plot type." };
  }

  const state = typeof body.state === "string" ? body.state.trim() : "";
  const city = typeof body.city === "string" ? body.city.trim() : "";
  const locality = typeof body.locality === "string" ? body.locality.trim() : "";
  if (!state || !city || !locality) {
    return { error: "Please fill in state, city and locality." };
  }

  const areaUnit: AreaUnit = AREA_UNIT_VALUES.includes(body.areaUnit as string)
    ? (body.areaUnit as AreaUnit)
    : "sqft";
  const areaValue = Number(body.areaValue);
  if (!areaValue || areaValue <= 0) {
    return { error: "Please enter a valid plot size." };
  }
  const areaSqft = toSqft(areaValue, areaUnit);

  // The form collects price in ₹ Lakh (matching how Indian real estate is
  // priced/discussed) — price_lakh is stored as-is; totalRupees is only an
  // intermediate used to compute the genuinely rupee-denominated columns
  // (price_per_sqft, price_per_unit).
  const priceLakh = Number(body.priceLakh);
  if (!priceLakh || priceLakh <= 0) {
    return { error: "Please enter a valid price." };
  }
  const totalRupees = priceLakh * 100000;
  if (totalRupees < 10000) {
    return { error: "That price looks too low — please check the amount (minimum ₹10,000)." };
  }
  const pricePerSqft = totalRupees / areaSqft;
  const overridePerUnit = Number(body.pricePerUnitOverride);
  const pricePerUnit = overridePerUnit > 0 ? overridePerUnit : totalRupees / areaValue;

  const ownershipType = (OWNERSHIP_TYPES as readonly string[]).includes(body.ownershipType as string)
    ? (body.ownershipType as string)
    : null;
  const transactionType = (TRANSACTION_TYPES as readonly string[]).includes(
    body.transactionType as string
  )
    ? (body.transactionType as string)
    : null;
  const naStatus = (NA_STATUS_OPTIONS as readonly string[]).includes(body.naStatus as string)
    ? (body.naStatus as string)
    : null;
  const documents = sanitizeDocuments(body.documents);

  const mapsLink =
    typeof body.mapsLink === "string" ? body.mapsLink.trim().slice(0, 500) || null : null;
  const facing = typeof body.facing === "string" && body.facing ? body.facing : "East";
  const roadWidthFt = Number(body.roadWidthFt) || 0;
  const cornerPlot = typeof body.cornerPlot === "boolean" ? body.cornerPlot : null;
  const boundaryWall = typeof body.boundaryWall === "boolean" ? body.boundaryWall : null;
  const gatedLayout = typeof body.gatedLayout === "boolean" ? body.gatedLayout : null;
  const possession =
    typeof body.possession === "string" ? body.possession.trim().slice(0, 100) || null : null;
  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 2000) : "";
  const photoUrls = Array.isArray(body.photoUrls)
    ? body.photoUrls.filter((u: unknown): u is string => typeof u === "string").slice(0, 8)
    : [];

  return {
    value: {
      title,
      plot_type: plotType,
      city,
      locality,
      state,
      area_sqft: areaSqft,
      area_unit: areaUnit,
      area_value: areaValue,
      price_lakh: priceLakh,
      price_per_sqft: pricePerSqft,
      price_per_unit: pricePerUnit,
      facing,
      road_width_ft: roadWidthFt,
      description,
      maps_link: mapsLink,
      ownership_type: ownershipType,
      transaction_type: transactionType,
      na_status: naStatus,
      documents,
      corner_plot: cornerPlot,
      boundary_wall: boundaryWall,
      gated_layout: gatedLayout,
      possession,
      photo_urls: photoUrls,
      images: photoUrls.length,
    },
  };
}
