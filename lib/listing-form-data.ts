export const OWNERSHIP_TYPES = ["Freehold", "Leasehold", "Power of Attorney"] as const;
export type OwnershipType = (typeof OWNERSHIP_TYPES)[number];

export const TRANSACTION_TYPES = ["New", "Resale"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const NA_STATUS_OPTIONS = ["Yes", "No", "Don't know"] as const;
export type NaStatus = (typeof NA_STATUS_OPTIONS)[number];

export const FACING_OPTIONS = [
  "North",
  "South",
  "East",
  "West",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
] as const;

export const POSSESSION_OPTIONS = ["Immediate", "By date"] as const;

// Document checklist. `land_record` and `rera` / `layout` have a dynamic
// label or reveal an extra field, handled in the form component.
export const DOCUMENT_FIELDS = [
  { key: "sale_deed", label: "Sale Deed" },
  { key: "title_clear", label: "Title clear" },
  { key: "ec", label: "Encumbrance Certificate (EC)" },
  { key: "mutation_done", label: "Mutation done" },
  { key: "land_record", label: "Land record extract" }, // label overridden per-state in the form
  { key: "rera_registered", label: "RERA registered" }, // reveals rera_number
  { key: "layout_approved", label: "Layout approved" }, // reveals layout_authority
] as const;

export type DocumentKey = (typeof DOCUMENT_FIELDS)[number]["key"];

export interface ListingDocuments {
  sale_deed?: boolean;
  title_clear?: boolean;
  ec?: boolean;
  mutation_done?: boolean;
  land_record?: boolean;
  rera_registered?: boolean;
  rera_number?: string | null;
  layout_approved?: boolean;
  layout_authority?: string | null;
}

export const DOCUMENT_BADGE_LABELS: Record<DocumentKey, string> = {
  sale_deed: "Sale Deed",
  title_clear: "Title clear",
  ec: "EC available",
  mutation_done: "Mutation done",
  land_record: "Land record",
  rera_registered: "RERA registered",
  layout_approved: "Layout approved",
};

const DOCUMENT_KEYS = DOCUMENT_FIELDS.map((f) => f.key);

/** Strips an arbitrary object down to the known document checklist shape for safe DB storage. */
export function sanitizeDocuments(input: unknown): ListingDocuments {
  if (!input || typeof input !== "object") return {};
  const source = input as Record<string, unknown>;
  const result: ListingDocuments = {};

  for (const key of DOCUMENT_KEYS) {
    if (typeof source[key] === "boolean") {
      result[key] = source[key] as boolean;
    }
  }
  if (result.rera_registered && typeof source.rera_number === "string") {
    result.rera_number = source.rera_number.trim().slice(0, 100) || null;
  }
  if (result.layout_approved && typeof source.layout_authority === "string") {
    result.layout_authority = source.layout_authority.trim().slice(0, 100) || null;
  }
  return result;
}
