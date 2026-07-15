import { redirect } from "next/navigation";
import { Users, Building2, Wallet, IndianRupee, Download } from "lucide-react";
import { isAuthenticated } from "@/lib/admin-auth";
import { getAdminOverview } from "@/lib/admin-stats";
import AdminShell from "@/components/admin/AdminShell";
import { TrendChart, BarList } from "@/components/admin/AdminCharts";

export const metadata = {
  title: "Overview · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

function formatINR(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="coord-label text-navy/50">{label}</p>
        <Icon size={18} className="text-green" />
      </div>
      <p className="mt-2 font-display text-3xl font-bold text-navy">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="font-display font-semibold text-navy">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const EXPORTS = [
  { type: "users", label: "Users" },
  { type: "listings", label: "Listings" },
  { type: "reveals", label: "Reveals" },
  { type: "revenue", label: "Revenue" },
];

export default async function AdminOverviewPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const o = await getAdminOverview();

  return (
    <AdminShell active="overview">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Overview</h1>
          <p className="mt-1 text-sm opacity-60">Platform metrics at a glance.</p>
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

      {!o.live && (
        <div className="mb-6 rounded-lg border border-amber bg-amber-light/40 p-3 text-sm text-navy">
          Showing sample figures from seed data — connect the database (Supabase env) to see live
          platform metrics.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={o.totals.users.toLocaleString("en-IN")}
          sub={`+${o.thisMonth.users} this month`}
          icon={Users}
        />
        <StatCard
          label="Total Listings"
          value={o.totals.listings.toLocaleString("en-IN")}
          sub={`${o.totals.liveListings} live · +${o.thisMonth.listings} this month`}
          icon={Building2}
        />
        <StatCard
          label="Active Transactions"
          value={o.totals.activeTransactions.toLocaleString("en-IN")}
          sub="Reveals in last 30 days"
          icon={Wallet}
        />
        <StatCard
          label="Revenue (est.)"
          value={formatINR(o.totals.revenue)}
          sub={`${o.totals.reveals} reveals · +${o.thisMonth.reveals} this month`}
          icon={IndianRupee}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="User growth (30 days)">
          <TrendChart points={o.series.users} color="var(--color-green-bright)" />
        </ChartCard>
        <ChartCard title="Listings growth (30 days)">
          <TrendChart points={o.series.listings} color="var(--color-amber)" />
        </ChartCard>
        <ChartCard title="Revenue trend (30 days)">
          <TrendChart points={o.series.revenue} color="var(--color-india-green)" />
        </ChartCard>
        <ChartCard title="Listings by city">
          <BarList items={o.cityDistribution} />
        </ChartCard>
      </div>

      <p className="mt-6 text-xs opacity-50">
        Revenue is an estimate: paid contact reveals × ₹{499}. Full payment records arrive with the
        Razorpay integration.
      </p>
    </AdminShell>
  );
}
