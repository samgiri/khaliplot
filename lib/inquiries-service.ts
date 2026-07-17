import { supabaseAdmin } from "@/lib/supabase-admin";

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

  try {
    const { error } = await supabaseAdmin.from("inquiries").insert({
      source: "contact_form",
      name,
      phone: phone || null,
      email: email || null,
      inquiry_type: inquiryType,
      message,
      ip_address: ipAddress || null,
    });

    if (error) {
      return { ok: false, error: "Couldn't save your message.", status: 500 };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't save your message.", status: 500 };
  }
}
