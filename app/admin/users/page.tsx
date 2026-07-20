import { redirect } from "next/navigation";
import { Users, UserPlus, PieChart, Trophy } from "lucide-react";
import { isAuthenticated } from "@/lib/admin-auth";
import { getUsersOverview } from "@/lib/admin-stats";
import AdminShell from "@/components/admin/AdminShell";
import { TrendChart, BarList } from "@/components/admin/AdminCharts";

export const metadata = {
  title: "Users · Admin | KhaliPlot.in",
  robots: { index: false, follow: false },
};

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

function ChartCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-5">
      <h3 className="flex items-center gap-2 font-display font-semibold text-navy">
        <Icon size={16} className="text-green" />
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function AdminUsersPage() {
  if (!(await isAuthenticated())) {
    redirect("/admin/login");
  }

  const o = await getUsersOverview();
  const signupsThisWindow = o.signupTrend.reduce((sum, p) => sum + p.value, 0);
  // BarList is keyed on `city`; reuse it for the role distribution.
  const roleItems = o.roleBreakdown.map((r) => ({ city: titleCase(r.role), count: r.count }));

  return (
    <AdminShell active="users">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm opacity-60">Signups and role distribution across the platform.</p>
      </div>

      {!o.live && (
        <div className="mb-6 rounded-lg border border-amber bg-amber-light/40 p-3 text-sm text-navy">
          Showing sample figures from seed data — connect the database (Supabase env) to see live
          user metrics.
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={o.activeUsers.toLocaleString("en-IN")}
          sub="Registered accounts"
          icon={Users}
        />
        <StatCard
          label="New (30 days)"
          value={signupsThisWindow.toLocaleString("en-IN")}
          sub="Signups in the last 30 days"
          icon={UserPlus}
        />
        <StatCard
          label="Roles"
          value={o.roleBreakdown.length.toLocaleString("en-IN")}
          sub={o.roleBreakdown.map((r) => `${r.count} ${r.role}`).join(" · ") || "No users yet"}
          icon={PieChart}
        />
        <StatCard
          label="Founding 100"
          value={`${o.founding100Used} / ${o.founding100Seats}`}
          sub={`${Math.max(0, o.founding100Seats - o.founding100Used)} spots left`}
          icon={Trophy}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Signups (30 days)" icon={UserPlus}>
          <TrendChart points={o.signupTrend} color="var(--color-green-bright)" />
        </ChartCard>
        <ChartCard title="Users by role" icon={PieChart}>
          <BarList items={roleItems} emptyLabel="No users yet" />
        </ChartCard>
      </div>
    </AdminShell>
  );
}
