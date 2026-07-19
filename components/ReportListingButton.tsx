"use client";

import { useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import { showToast } from "@/components/Toaster";
import { REPORT_REASONS } from "@/lib/report-reasons";

export default function ReportListingButton({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (submitting) return;
    setOpen(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Please choose a reason.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(listingId)}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, details, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not submit your report.");
      }
      setOpen(false);
      setReason("");
      setDetails("");
      setEmail("");
      showToast("Thanks — we'll review this listing.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit your report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-amber-dark"
      >
        <Flag size={14} />
        Report this listing
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy/40 p-4 sm:p-8"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-xl border-2 border-navy bg-paper p-5 shadow-[6px_6px_0_0_var(--color-amber)] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-navy">
                <Flag size={18} className="text-amber-dark" />
                Report this listing
              </h2>
              <button onClick={close} aria-label="Close" disabled={submitting}>
                <X size={22} className="text-navy" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="report-reason" className="text-sm font-semibold text-navy">
                  Reason
                </label>
                <select
                  id="report-reason"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                >
                  <option value="" disabled>
                    Choose a reason…
                  </option>
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="report-details" className="text-sm font-semibold text-navy">
                  Details <span className="font-normal text-muted">(optional)</span>
                </label>
                <textarea
                  id="report-details"
                  rows={3}
                  maxLength={2000}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us what's wrong with this listing."
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                />
              </div>

              <div>
                <label htmlFor="report-email" className="text-sm font-semibold text-navy">
                  Your email <span className="font-normal text-muted">(optional)</span>
                </label>
                <input
                  id="report-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="So we can follow up if needed"
                  className="mt-1.5 w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm focus:border-green-bright"
                />
              </div>

              {error && <p className="text-sm text-amber-dark">{error}</p>}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={close}
                  disabled={submitting}
                  className="rounded-md border border-line px-4 py-2 font-semibold text-navy hover:border-green-bright disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-md bg-amber px-5 py-2 font-semibold text-navy transition-colors hover:bg-amber-dark disabled:opacity-60"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Sending…" : "Submit report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
