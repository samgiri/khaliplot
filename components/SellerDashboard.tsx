"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Pencil,
  CheckCircle2,
  Trash2,
  Loader2,
  ArrowRight,
  List,
  Eye,
  MessageSquare,
  ImageOff,
} from "lucide-react";
import { type Listing, formatPrice, formatArea, formatLocation } from "@/lib/data";

const STATUS_BADGE_STYLES: Record<string, string> = {
  live: "bg-green-pale text-green",
  sold: "bg-line text-muted",
  removed: "bg-amber/20 text-amber-dark",
};

const STATUS_LABELS: Record<string, string> = {
  live: "Active",
  sold: "Sold",
  removed: "Removed",
};

function StatCard({
  icon: Icon,
  label,
  value,
  badge,
}: {
  icon: typeof Eye;
  label: string;
  value: string | number;
  badge?: string;
}) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-pale text-green">
          <Icon size={20} />
        </div>
        {badge && (
          <span className="rounded-full bg-amber px-2.5 py-1 text-xs font-semibold text-navy">{badge}</span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default function SellerDashboard({
  initialListings,
  activeCount,
  limit,
  viewCounts,
  leadCounts,
  totalLeads,
  newLeads,
}: {
  initialListings: Listing[];
  activeCount: number;
  limit: number;
  viewCounts: Record<string, number>;
  leadCounts: Record<string, number>;
  totalLeads: number;
  newLeads: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState(initialListings);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const showPostedToast = searchParams.get("posted") === "1";
  const showUpdatedToast = searchParams.get("updated") === "1";

  const visibleListings = listings.filter((l) => l.status !== "removed");
  const totalViews = visibleListings.reduce((sum, l) => sum + (viewCounts[l.id] ?? 0), 0);
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
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="coord-label text-green">Seller dashboard</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-navy sm:text-3xl">Your plots</h1>
          <p className="mt-1 text-sm text-muted">
            {activeCount} of {limit} active listing{limit === 1 ? "" : "s"} used
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/seller/leads"
            className="flex items-center gap-1.5 rounded-md border border-line bg-white px-4 py-2 font-semibold text-navy transition-colors hover:border-green-bright"
          >
            <MessageSquare size={18} />
            Leads
            {newLeads > 0 && (
              <span className="rounded-full bg-amber px-2 py-0.5 text-xs font-bold text-navy">{newLeads}</span>
            )}
          </Link>
          <Link
            href="/seller/listings/new"
            className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy transition-colors hover:bg-amber-dark"
          >
            <Plus size={18} />
            New listing
          </Link>
        </div>
      </div>

      {(showPostedToast || showUpdatedToast) && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-bright bg-green-pale px-4 py-3 text-sm font-semibold text-green">
          <CheckCircle2 size={18} />
          {showPostedToast ? "Your plot is live." : "Your changes are saved."}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-line bg-paper-dim px-4 py-3 text-sm text-amber-dark">
          {error}
        </div>
      )}

      {/* Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={List} label="Active listings" value={`${activeCount}/${limit}`} />
        <StatCard icon={Eye} label="Views on your plots" value={totalViews} />
        <StatCard
          icon={MessageSquare}
          label="Leads received"
          value={totalLeads}
          badge={newLeads > 0 ? `${newLeads} new` : undefined}
        />
      </div>

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
            href="/seller/listings/new"
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-amber px-5 py-2.5 font-semibold text-navy hover:bg-amber-dark"
          >
            Post a plot
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleListings.map((listing) => {
            const coverPhoto = listing.photoUrls?.[0];
            const views = viewCounts[listing.id] ?? 0;
            const leads = leadCounts[listing.id] ?? 0;

            return (
              <div
                key={listing.id}
                className="plot-border plot-border-hover flex flex-col gap-4 rounded-lg bg-white p-4 sm:flex-row sm:items-center"
              >
                <Link
                  href={`/listing/${listing.id}`}
                  className="flex h-24 w-full shrink-0 items-center justify-center overflow-hidden rounded-md bg-green-pale sm:w-32"
                >
                  {coverPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverPhoto} alt={listing.title} className="h-full w-full object-cover" />
                  ) : (
                    <ImageOff size={24} strokeWidth={1.5} className="text-green/40" />
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="font-display font-semibold text-navy hover:text-green"
                    >
                      {listing.title}
                    </Link>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE_STYLES[listing.status ?? "live"] ?? "bg-line text-muted"}`}
                    >
                      {STATUS_LABELS[listing.status ?? "live"] ?? listing.status}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {formatLocation(listing.locality, listing.city)} · {formatArea(listing.areaSqft)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-display font-bold text-navy">{formatPrice(listing.priceLakh)}</span>
                    <span className="flex items-center gap-1 text-muted">
                      <Eye size={14} /> {views} view{views === 1 ? "" : "s"}
                    </span>
                    <span className="flex items-center gap-1 text-muted">
                      <MessageSquare size={14} /> {leads} lead{leads === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/seller/listings/${listing.id}/edit`}
                    className="flex items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy hover:border-green-bright"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  {listing.status === "live" && (
                    <button
                      onClick={() => runAction(listing.id, "mark_sold")}
                      disabled={busyId === listing.id}
                      className="flex items-center justify-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm font-semibold text-navy hover:border-green-bright disabled:opacity-60"
                    >
                      {busyId === listing.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
