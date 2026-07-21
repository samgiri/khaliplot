"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Users, UserPlus, PieChart, Trophy, Tag } from "lucide-react";
import {
  StatCard,
  Badge,
  LoadingState,
  ErrorState,
  SampleDataBanner,
  DataTable,
  Th,
  Td,
  fmtDate,
} from "@/components/admin/AdminUi";
import { TrendChart, BarList } from "@/components/admin/AdminCharts";
import type { DayPoint } from "@/lib/admin-stats";
import { PARTNER_TYPE_LABELS, type PartnerType } from "@/lib/partner-types";
import AssignPackageModal, { type PackageTargetUser } from "@/components/admin/AssignPackageModal";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  subscription_tier: string;
  partner_type: string | null;
  created_at: string;
}

interface UsersData {
  live: boolean;
  activeUsers: number;
  signupTrend: { date: string; count: number }[];
  roleBreakdown: Record<string, number>;
  founding100Used: number;
  founding100Seats: number;
  users: UserRow[];
  total: number;
}

const ROLES = ["buyer", "seller", "broker", "builder"] as const;
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const tierTone = (tier: string) => (tier === "free" ? "muted" : "green");

/** Reattach a chart-friendly label to the {date,count} points the API returns. */
function toDayPoints(points: { date: string; count: number }[]): DayPoint[] {
  return points.map((p) => ({
    date: p.date,
    value: p.count,
    label: new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));
}

export default function UsersClient() {
  const [data, setData] = useState<UsersData | null>(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [assignTarget, setAssignTarget] = useState<PackageTargetUser | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback((search: string, roleFilter: string) => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (roleFilter) params.set("role", roleFilter);
    fetch(`/api/admin/users?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch(() => setError("Could not load users."));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(q, role), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q, role, load]);

  const signupsThisWindow = data?.signupTrend.reduce((sum, p) => sum + p.count, 0) ?? 0;
  const roleItems = data
    ? Object.entries(data.roleBreakdown)
        .map(([r, count]) => ({ city: titleCase(r), count }))
        .sort((a, b) => b.count - a.count)
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Users</h1>
        <p className="mt-1 text-sm opacity-60">
          Signups, role distribution and partner package assignment.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {!error && !data && <LoadingState label="Loading users…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Users"
              value={data.activeUsers.toLocaleString("en-IN")}
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
              value={Object.keys(data.roleBreakdown).length.toLocaleString("en-IN")}
              sub={
                Object.entries(data.roleBreakdown)
                  .map(([r, count]) => `${count} ${r}`)
                  .join(" · ") || "No users yet"
              }
              icon={PieChart}
            />
            <StatCard
              label="Founding 100"
              value={`${data.founding100Used} / ${data.founding100Seats}`}
              sub={`${Math.max(0, data.founding100Seats - data.founding100Used)} spots left`}
              icon={Trophy}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-line bg-white p-5">
              <h3 className="flex items-center gap-2 font-display font-semibold text-navy">
                <UserPlus size={16} className="text-green" />
                Signups (30 days)
              </h3>
              <div className="mt-4">
                <TrendChart points={toDayPoints(data.signupTrend)} color="var(--color-green-bright)" />
              </div>
            </div>
            <div className="rounded-xl border border-line bg-white p-5">
              <h3 className="flex items-center gap-2 font-display font-semibold text-navy">
                <PieChart size={16} className="text-green" />
                Users by role
              </h3>
              <div className="mt-4">
                <BarList items={roleItems} emptyLabel="No users yet" />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-display font-semibold text-navy">
                <Tag size={16} className="text-green" />
                All users
              </h3>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  placeholder="Search name, email, phone…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="rounded-md border border-line bg-white px-3 py-1.5 text-sm focus:border-green-bright"
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="rounded-md border border-line bg-white px-3 py-1.5 text-sm focus:border-green-bright"
                >
                  <option value="">All roles</option>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {titleCase(r)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {data.users.length === 0 ? (
              <p className="text-sm text-muted">No users match this filter.</p>
            ) : (
              <DataTable
                head={
                  <>
                    <Th>User</Th>
                    <Th>Role</Th>
                    <Th>Partner Type</Th>
                    <Th>Package</Th>
                    <Th>Joined</Th>
                    <Th>Actions</Th>
                  </>
                }
              >
                {data.users.map((u) => (
                  <tr key={u.id} className="border-b border-line last:border-b-0">
                    <Td>
                      <span className="font-medium text-navy">{u.name || "Unnamed"}</span>
                      <span className="block text-xs text-muted">{u.email || u.phone || "—"}</span>
                    </Td>
                    <Td>
                      <Badge tone="muted">{titleCase(u.role)}</Badge>
                    </Td>
                    <Td>
                      {u.partner_type ? (
                        <Badge tone="amber">
                          {PARTNER_TYPE_LABELS[u.partner_type as PartnerType] ?? u.partner_type}
                        </Badge>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Td>
                    <Td>
                      <Badge tone={tierTone(u.subscription_tier)}>{u.subscription_tier}</Badge>
                    </Td>
                    <Td>{fmtDate(u.created_at)}</Td>
                    <Td>
                      <button
                        onClick={() =>
                          setAssignTarget({
                            id: u.id,
                            name: u.name,
                            email: u.email,
                            partner_type: u.partner_type,
                          })
                        }
                        className="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-navy hover:border-green-bright"
                      >
                        Assign Package
                      </button>
                    </Td>
                  </tr>
                ))}
              </DataTable>
            )}
          </div>
        </>
      )}

      {assignTarget && (
        <AssignPackageModal
          presetUser={assignTarget}
          onClose={() => setAssignTarget(null)}
          onAssigned={() => load(q, role)}
        />
      )}
    </div>
  );
}
