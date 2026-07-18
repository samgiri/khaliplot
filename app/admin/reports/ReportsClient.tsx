"use client";

import { useEffect, useState } from "react";
import { Users, Building2, KeyRound, Wallet, IndianRupee, Download } from "lucide-react";
import {
  StatCard,
  LoadingState,
  ErrorState,
  SampleDataBanner,
  formatINR,
  fmtDate,
} from "@/components/admin/AdminUi";

const PERIODS = [
  { key: "day", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
] as const;
type Period = (typeof PERIODS)[number]["key"];

const EXPORTS = [
  { type: "users", label: "Users" },
  { type: "listings", label: "Listings" },
  { type: "reveals", label: "Reveals" },
  { type: "revenue", label: "Revenue" },
];

interface ReportData {
  live: boolean;
  period: string;
  since: string;
  summary: {
    newUsers: number;
    newListings: number;
    reveals: number;
    paidReveals: number;
    revenue: number;
  };
}

export default function ReportsClient() {
  const [period, setPeriod] = useState<Period>("week");
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/reports?period=${period}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the report.");
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  // Reset to the loading state in the click handler (not the effect) when the
  // window changes, so the effect never calls setState synchronously.
  function changePeriod(next: Period) {
    if (next === period) return;
    setData(null);
    setError("");
    setPeriod(next);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Reports</h1>
          <p className="mt-1 text-sm opacity-60">Activity summary for the selected window.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 hidden text-xs opacity-60 sm:inline">Export CSV:</span>
          {EXPORTS.map((e) => (
            <a
              key={e.type}
              href={`/api/admin/export?type=${e.type}`}
              className="flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:border-navy"
            >
              <Download size={14} />
              {e.label}
            </a>
          ))}
        </div>
      </div>

      {/* Period selector */}
      <div className="mb-6 inline-flex rounded-lg border border-line bg-white p-1">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => changePeriod(p.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              period === p.key ? "bg-navy text-paper" : "text-navy hover:bg-paper-dim"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <ErrorState message={error} />}
      {!error && !data && <LoadingState label="Building report…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <p className="mb-4 text-sm text-muted">
            Since <span className="font-semibold text-navy">{fmtDate(data.since)}</span>
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="New Users"
              value={data.summary.newUsers.toLocaleString("en-IN")}
              icon={Users}
            />
            <StatCard
              label="New Listings"
              value={data.summary.newListings.toLocaleString("en-IN")}
              icon={Building2}
            />
            <StatCard
              label="Reveals"
              value={data.summary.reveals.toLocaleString("en-IN")}
              icon={KeyRound}
            />
            <StatCard
              label="Paid Reveals"
              value={data.summary.paidReveals.toLocaleString("en-IN")}
              icon={Wallet}
            />
            <StatCard
              label="Revenue (est.)"
              value={formatINR(data.summary.revenue)}
              sub="Paid reveals × ₹499"
              icon={IndianRupee}
            />
          </div>
        </>
      )}
    </div>
  );
}
