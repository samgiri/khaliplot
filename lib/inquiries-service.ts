import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase-admin";
import { REPORT_REASONS, type ReportReason } from "@/lib/report-reasons";

// Contact-form inquiry handling. The public /contact page and any other
// anonymous "get in touch" entry point funnel through here so validation and
// the insert shape stay in one place (matching the Part 1 brief, which names
// lib/inquiries-service.ts as the contact-form handler).

export const INQUIRY_TYPES = [
  "buying",
  "selling",
  "listing",
  "pricing",
  "partnership",
  "other",
] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export interface ContactInquiryInput {
  name: unknown;
  phone: unknown;
  email: unknown;
  inquiryType: unknown;
  message: unknown;
}

export type ContactInquiryResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

/**
 * Validate and persist a public contact-form submission.
 *
 * `ipAddress` is captured server-side (from the request) purely for basic
 * abuse tracking — it is only ever stored for anonymous contact-form rows,
 * never for authenticated buyer <-> seller inquiries.
 */
export async function createContactInquiry(
  input: ContactInquiryInput,
  ipAddress: string
): Promise<ContactInquiryResult> {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  const inquiryType: InquiryType = INQUIRY_TYPES.includes(input.inquiryType as InquiryType)
    ? (input.inquiryType as InquiryType)
    : "other";

  if (!name || name.length > 100) {
    return { ok: false, error: "Please enter a valid name.", status: 400 };
  }
  if (!message || message.length > 2000) {
    return { ok: false, error: "Please enter a message.", status: 400 };
  }
  if (!phone && !email) {
    return { ok: false, error: "Please provide a phone number or an email.", status: 400 };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email.", status: 400 };
  }
  if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {
    return { ok: false, error: "Please enter a valid phone number.", status: 400 };
  }

  // Missing service-role env vars is a deployment/config problem, not the
  // visitor's fault — surface it distinctly (and loudly in the logs) so it's
  // obvious in Vercel that SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL
  // aren't set, rather than hiding behind a generic "couldn't save" message.
  if (!isSupabaseAdminConfigured()) {
    console.error(
      "[contact] Supabase admin not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    return {
      ok: false,
      error: "We're unable to receive messages right now. Please WhatsApp or email us instead.",
      status: 503,
    };
  }

  try {
    const { error } = await supabaseAdmin.from("inquiries").insert({
      source: "contact_form",
      // `channel` is NOT NULL with no default (schema_phase1_auth.sql) and the
      // Part 1 migration never relaxed it, so contact-form rows must set it — a
      // website form submission maps to the 'website' channel.
      channel: "website",
      name,
      phone: phone || null,
      email: email || null,
      inquiry_type: inquiryType,
      message,
      ip_address: ipAddress || null,
    });

    if (error) {
      // Log the real Postgres/PostgREST error so the cause is visible in the
      // server logs. A NOT NULL violation on buyer_id/seller_id/plot_id or a
      // "column ... does not exist" here means schema_part1_contact_form.sql
      // hasn't been applied to this database yet.
      console.error("[contact] insert into inquiries failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return { ok: false, error: "Couldn't save your message.", status: 500 };
    }

    return { ok: true };
  } catch (err) {
    console.error("[contact] unexpected error saving inquiry:", err);
    return { ok: false, error: "Couldn't save your message.", status: 500 };
  }
}

export interface ListingReportInput {
  plotId: unknown;
  reason: unknown;
  details?: unknown;
  reporterEmail?: unknown;
}

/**
 * Persist a "report this listing" flag. Stored in the same `inquiries` table as
 * contact-form submissions (source = 'report_listing'), so no migration is
 * needed and reports land in the admin Support inbox alongside other messages.
 *
 * `plot_id` is FK'd to a real listings row. Seed-only listings (not in the DB)
 * would violate that FK, so on a foreign-key error we retry with a null plot_id
 * and keep the reported id in the message text.
 */
export async function createListingReport(
  input: ListingReportInput,
  ipAddress: string
): Promise<ContactInquiryResult> {
  const plotId = typeof input.plotId === "string" ? input.plotId.trim() : "";
  const reason = REPORT_REASONS.includes(input.reason as ReportReason)
    ? (input.reason as ReportReason)
    : "";
  const details = typeof input.details === "string" ? input.details.trim() : "";
  const reporterEmail = typeof input.reporterEmail === "string" ? input.reporterEmail.trim() : "";

  if (!plotId) {
    return { ok: false, error: "Missing listing reference.", status: 400 };
  }
  if (!reason) {
    return { ok: false, error: "Please choose a reason for the report.", status: 400 };
  }
  if (details.length > 2000) {
    return { ok: false, error: "Please shorten the details.", status: 400 };
  }
  if (reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
    return { ok: false, error: "Please enter a valid email.", status: 400 };
  }

  const message = `Report reason: ${reason}${details ? `\n\n${details}` : ""}`;
  const baseRow = {
    source: "report_listing",
    channel: "website", // NOT NULL column — see createContactInquiry
    inquiry_type: "other" as const,
    email: reporterEmail || null,
    ip_address: ipAddress || null,
  };

  try {
    const first = await supabaseAdmin
      .from("inquiries")
      .insert({ ...baseRow, plot_id: plotId, message });
    if (!first.error) return { ok: true };

    // 23503 = foreign_key_violation → the plot isn't a DB row (seed listing).
    if (first.error.code === "23503") {
      const retry = await supabaseAdmin.from("inquiries").insert({
        ...baseRow,
        plot_id: null,
        message: `Reported listing: ${plotId}\n${message}`,
      });
      if (!retry.error) return { ok: true };
    }

    return { ok: false, error: "Couldn't submit your report.", status: 500 };
  } catch {
    return { ok: false, error: "Couldn't submit your report.", status: 500 };
  }
}
