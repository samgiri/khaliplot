// State -> the locally-standard land record document name, shown as a
// dynamic label in the post-plot documents checklist and on the listing
// detail compliance badges.
const LAND_RECORD_BY_STATE: Record<string, string> = {
  Maharashtra: "7/12 (Satbara)",
  Gujarat: "7/12 (Satbara)",
  Goa: "7/12 (Satbara)",
  Rajasthan: "Jamabandi",
  Haryana: "Jamabandi",
  Punjab: "Jamabandi",
  "Himachal Pradesh": "Jamabandi",
  "Uttar Pradesh": "Khasra/Khatauni",
  Uttarakhand: "Khasra/Khatauni",
  "Madhya Pradesh": "Khasra/Khatauni",
  Chhattisgarh: "Khasra/Khatauni",
  Bihar: "Khasra/Khatauni",
  Jharkhand: "Khasra/Khatauni",
  Karnataka: "RTC (Pahani)",
  "Tamil Nadu": "Patta/Chitta",
  Telangana: "Pattadar Passbook (1B)",
  "Andhra Pradesh": "Pattadar Passbook (1B)",
  Kerala: "Thandaper",
  "Delhi NCR": "Mutation/Registry",
};

const DEFAULT_LAND_RECORD_LABEL = "Land record";

export function getLandRecordLabel(state: string | null | undefined): string {
  if (!state) return DEFAULT_LAND_RECORD_LABEL;
  return LAND_RECORD_BY_STATE[state] ?? DEFAULT_LAND_RECORD_LABEL;
}
