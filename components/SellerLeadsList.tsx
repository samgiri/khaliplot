"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Loader2,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Send,
  CheckCircle2,
  Archive,
  RotateCcw,
} from "lucide-react";
import type { SellerLead, LeadStatus } from "@/lib/seller-dashboard-service";

const CHANNEL_ICONS: Record<string, typeof Phone> = {
  call: Phone,
  email: Mail,
  whatsapp: MessageSquare,
  telegram: Send,
  website: Globe,
  message: MessageSquare,
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber/20 text-amber-dark",
  contacted: "bg-green-pale text-green",
  closed: "bg-line text-muted",
};

const FILTERS: { value: "all" | LeadStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function SellerLeadsList({ initialLeads }: { initialLeads: SellerLead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [filter, setFilter] = useState<"all" | LeadStatus>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const visibleLeads = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const countFor = (value: "all" | LeadStatus) =>
    value === "all" ? leads.length : leads.filter((l) => l.status === value).length;

  async function setStatus(id: string, status: LeadStatus) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();

      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      router.refresh();
    } catch {
      setError("Couldn't update that lead. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
              filter === value
                ? "bg-navy text-paper"
                : "border border-line bg-white text-muted hover:border-green-bright hover:text-navy"
            }`}
          >
            {label} ({countFor(value)})
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-line bg-paper-dim px-4 py-3 text-sm text-amber-dark">
          {error}
        </div>
      )}

      {visibleLeads.length === 0 ? (
        <div className="plot-border mt-4 flex items-center gap-4 rounded-lg bg-white p-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-pale text-green">
            <MessageSquare size={22} />
          </div>
          <div>
            <p className="font-display font-semibold text-navy">
              {leads.length === 0 ? "No leads yet" : "Nothing here"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {leads.length === 0
                ? "When a buyer contacts you about one of your plots, their inquiry will show up here."
                : "No leads match this filter."}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {visibleLeads.map((lead) => {
            const ChannelIcon = CHANNEL_ICONS[lead.channel] ?? MessageSquare;
            const busy = busyId === lead.id;

            return (
              <div key={lead.id} className="plot-border rounded-lg bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-semibold text-navy">{lead.buyerName}</p>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[lead.status] ?? "bg-line text-muted"}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-sm text-muted">
                      <ChannelIcon size={14} className="shrink-0" />
                      Via {lead.channel} · {formatDate(lead.createdAt)} ·{" "}
                      <Link href={`/listing/${lead.plotId}`} className="font-semibold text-green hover:text-navy">
                        {lead.plotTitle}
                      </Link>
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {busy ? (
                      <span className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted">
                        <Loader2 size={14} className="animate-spin" /> Saving…
                      </span>
                    ) : (
                      <>
                        {lead.status === "new" && (
                          <button
                            onClick={() => setStatus(lead.id, "contacted")}
                            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:border-green-bright"
                          >
                            <CheckCircle2 size={14} />
                            Mark contacted
                          </button>
                        )}
                        {lead.status !== "closed" ? (
                          <button
                            onClick={() => setStatus(lead.id, "closed")}
                            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:border-green-bright hover:text-navy"
                          >
                            <Archive size={14} />
                            Close
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(lead.id, "new")}
                            className="flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:border-green-bright hover:text-navy"
                          >
                            <RotateCcw size={14} />
                            Reopen
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {lead.message && (
                  <p className="mt-3 rounded-md bg-paper-dim px-3.5 py-2.5 text-sm text-ink">{lead.message}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
