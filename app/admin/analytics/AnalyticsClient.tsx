"use client";

import { useEffect, useState } from "react";
import { Users, Building2, KeyRound, IndianRupee } from "lucide-react";
import { TrendChart, BarList } from "@/components/admin/AdminCharts";
import type { AdminOverview } from "@/lib/admin-stats";
import {
  StatCard,
  SectionCard,
  LoadingState,
  ErrorState,
  SampleDataBanner,
  formatINR,
} from "@/components/admin/AdminUi";

interface KeyCount {
  key: string;
  count: number;
}

interface AnalyticsData {
  live: boolean;
  overview: AdminOverview;
  breakdowns: {
    listingsByStatus: KeyCount[];
    usersByRole: KeyCount[];
    revealsByTier: KeyCount[];
  };
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
// BarList is keyed on `city`; adapt the {key,count} breakdowns to it.
const toBars = (items: KeyCount[]) => items.map((i) => ({ city: titleCase(i.key), count: i.count }));

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then(setData)
      .catch(() => setError("Could not load analytics."));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Analytics</h1>
        <p className="mt-1 text-sm opacity-60">Growth trends and platform breakdowns.</p>
      </div>

      {error && <ErrorState message={error} />}
      {!error && !data && <LoadingState label="Loading analytics…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Users"
              value={data.overview.totals.users.toLocaleString("en-IN")}
              sub={`+${data.overview.thisMonth.users} this month`}
              icon={Users}
            />
            <StatCard
              label="Total Listings"
              value={data.overview.totals.listings.toLocaleString("en-IN")}
              sub={`${data.overview.totals.liveListings} live`}
              icon={Building2}
            />
            <StatCard
              label="Reveals"
              value={data.overview.totals.reveals.toLocaleString("en-IN")}
              sub={`+${data.overview.thisMonth.reveals} this month`}
              icon={KeyRound}
            />
            <StatCard
              label="Revenue (est.)"
              value={formatINR(data.overview.totals.revenue)}
              sub="Paid reveals"
              icon={IndianRupee}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard title="User growth (30 days)" icon={Users}>
              <TrendChart points={data.overview.series.users} color="var(--color-green-bright)" />
            </SectionCard>
            <SectionCard title="Listings growth (30 days)" icon={Building2}>
              <TrendChart points={data.overview.series.listings} color="var(--color-amber)" />
            </SectionCard>
            <SectionCard title="Revenue trend (30 days)" icon={IndianRupee}>
              <TrendChart points={data.overview.series.revenue} color="var(--color-india-green)" />
            </SectionCard>
            <SectionCard title="Listings by city">
              <BarList items={data.overview.cityDistribution} />
            </SectionCard>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Listings by status">
              <BarList items={toBars(data.breakdowns.listingsByStatus)} />
            </SectionCard>
            <SectionCard title="Users by role">
              <BarList items={toBars(data.breakdowns.usersByRole)} />
            </SectionCard>
            <SectionCard title="Reveals by tier">
              <BarList items={toBars(data.breakdowns.revealsByTier)} />
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
