"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Plus, Pencil, CheckCircle2, Trash2, Loader2, ArrowRight } from "lucide-react";
import PlotCard from "@/components/PlotCard";
import type { Listing } from "@/lib/data";

export default function MyListingsClient({
  initialListings,
  activeCount,
  limit,
}: {
  initialListings: Listing[];
  activeCount: number;
  limit: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState(initialListings);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const showPostedToast = searchParams.get("posted") === "1";

  const visibleListings = listings.filter((l) => l.status !== "removed");
  const atLimit = activeCount >= limit;

  async function runAction(id: string, action: "mark_sold" | "remove") {
    if (action === "remove" && !confirm("Delete this listing? This can't be undone.")) return;

    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();

      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: action === "mark_sold" ? "sold" : "removed" } : l))
      );
      router.refresh();
    } catch {
      setError("Couldn't update that listing. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="coord-label text-green">My listings</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">Your plots</h1>
          <p className="mt-1 text-sm text-muted">
            {activeCount} of {limit} active listing{limit === 1 ? "" : "s"} used
          </p>
        </div>
        <Link
          href="/post-plot"
          className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy transition-colors hover:bg-amber-dark"
        >
          <Plus size={18} />
          Post a plot
        </Link>
      </div>

      {showPostedToast && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-bright bg-green-pale px-4 py-3 text-sm font-semibold text-green">
          <CheckCircle2 size={18} />
          Your plot is live.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-line bg-paper-dim px-4 py-3 text-sm text-amber-dark">
          {error}
        </div>
      )}

      {atLimit && (
        <div className="mb-6 rounded-xl border-2 border-navy bg-green-pale px-6 py-6 text-center shadow-[6px_6px_0_0_var(--color-navy)]">
          <p className="font-display font-semibold text-navy">
            You&apos;ve reached your {limit}-listing limit
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-ink/70">
            Upgrade your plan to post more active plots at once.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
          >
            See pricing plans <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {visibleListings.length === 0 ? (
        <div className="plot-border rounded-lg bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy">No plots yet</p>
          <p className="mt-2 text-sm text-muted">Post your first plot free — it takes about 5 minutes.</p>
          <Link
            href="/post-plot"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-amber px-5 py-2.5 font-semibold text-navy hover:bg-amber-dark"
          >
            Post a plot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleListings.map((listing) => (
            <div key={listing.id} className="flex flex-col gap-2">
              <PlotCard listing={listing} />
              <div className="flex gap-2">
                <Link
                  href={`/post-plot?edit=${listing.id}`}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy hover:border-green-bright"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
                {listing.status === "live" && (
                  <button
                    onClick={() => runAction(listing.id, "mark_sold")}
                    disabled={busyId === listing.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy hover:border-green-bright disabled:opacity-60"
                  >
                    {busyId === listing.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                    Mark sold
                  </button>
                )}
                <button
                  onClick={() => runAction(listing.id, "remove")}
                  disabled={busyId === listing.id}
                  aria-label="Delete listing"
                  className="flex items-center justify-center rounded-md border border-line px-3 py-2 text-amber-dark hover:border-amber-dark disabled:opacity-60"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
