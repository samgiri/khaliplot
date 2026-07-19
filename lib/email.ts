// Best-effort transactional email via the Resend REST API (https://resend.com).
//
// Deliberately dependency-free: we POST to the API directly, so no npm package
// is added. Every function is a no-op when RESEND_API_KEY isn't configured and
// NEVER throws — email must not block or fail the request that triggered it.
// The public site keeps working (and the DB row is still written) whether or
// not email is set up.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Verified sender. Override with CONTACT_FROM_EMAIL once your domain is
// verified in Resend; the default matches the address used across the site.
const DEFAULT_FROM = "KhaliPlot <hello@khaliplot.in>";
const KHALIPLOT_WHATSAPP = "919625763256";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Low-level send. Returns { sent } and swallows all errors. */
async function sendEmail({ to, subject, html, replyTo }: SendArgs): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return { sent: false };

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false };
  }
}

export interface ContactEmailInput {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
}

/** Confirmation auto-reply to the person who submitted the contact form. */
async function sendContactAutoReply(input: ContactEmailInput): Promise<void> {
  if (!input.email) return;
  const name = escapeHtml(input.name) || "there";
  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color:#001e3c; line-height:1.6; max-width:520px;">
      <h2 style="color:#001e3c; margin:0 0 12px;">Thanks for reaching out, ${name}!</h2>
      <p style="margin:0 0 12px;">We've received your message and the KhaliPlot team will reply within 24 hours.</p>
      <p style="margin:0 0 16px; color:#5b6b7c;">For a faster reply you can also WhatsApp us at
        <a href="https://wa.me/${KHALIPLOT_WHATSAPP}" style="color:#6ea028; font-weight:600;">+91 96257 63256</a>.</p>
      <hr style="border:none; border-top:1px solid #e7e2d8; margin:20px 0;">
      <p style="margin:0 0 6px; color:#5b6b7c; font-size:13px;">Your message:</p>
      <blockquote style="margin:0; padding:0 0 0 12px; border-left:3px solid #f5a623; color:#5b6b7c; font-size:14px; white-space:pre-wrap;">${escapeHtml(input.message)}</blockquote>
      <p style="margin:24px 0 0; color:#8a97a5; font-size:12px;">— Team KhaliPlot · Find Land. Own Your Future.</p>
    </div>`;

  await sendEmail({
    to: input.email,
    subject: "We got your message — KhaliPlot",
    html,
    replyTo: process.env.CONTACT_NOTIFY_EMAIL || undefined,
  });
}

/** Internal notification to the team inbox (only if CONTACT_NOTIFY_EMAIL set). */
async function notifyTeamOfInquiry(input: ContactEmailInput): Promise<void> {
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!to) return;
  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; color:#001e3c; line-height:1.6;">
      <h2 style="margin:0 0 12px;">New ${escapeHtml(input.inquiryType)} inquiry</h2>
      <p style="margin:0;"><strong>Name:</strong> ${escapeHtml(input.name) || "—"}</p>
      <p style="margin:0;"><strong>Email:</strong> ${escapeHtml(input.email) || "—"}</p>
      <p style="margin:0;"><strong>Phone:</strong> ${escapeHtml(input.phone) || "—"}</p>
      <p style="margin:12px 0 6px;"><strong>Message:</strong></p>
      <blockquote style="margin:0; padding:0 0 0 12px; border-left:3px solid #f5a623; white-space:pre-wrap;">${escapeHtml(input.message)}</blockquote>
    </div>`;

  await sendEmail({
    to,
    subject: `New ${input.inquiryType} inquiry from ${input.name || "a visitor"}`,
    html,
    replyTo: input.email || undefined,
  });
}

/**
 * Fire both the visitor auto-reply and the team notification. Runs them in
 * parallel, never throws, and resolves even if email isn't configured — the
 * caller can `await` it without risk to the request.
 */
export async function sendContactEmails(input: ContactEmailInput): Promise<void> {
  await Promise.allSettled([sendContactAutoReply(input), notifyTeamOfInquiry(input)]);
}
