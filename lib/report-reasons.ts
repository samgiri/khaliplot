// Shared "report a listing" reasons. Kept in its own module (no server imports)
// so both the client modal and the server-side service can use the same list
// without pulling the service-role Supabase client into the browser bundle.

export const REPORT_REASONS = [
  "Already sold",
  "Wrong or misleading info",
  "Suspected fraud or scam",
  "Duplicate listing",
  "Offensive or inappropriate",
  "Other",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];
