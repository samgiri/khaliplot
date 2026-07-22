"use client";

import { useCallback, useEffect, useState } from "react";
import { PackageCheck, Gift, IndianRupee, Plus, Clock } from "lucide-react";
import {
  StatCard,
  SectionCard,
  Badge,
  LoadingState,
  ErrorState,
  SampleDataBanner,
  DataTable,
  Th,
  Td,
  formatINR,
  fmtDate,
} from "@/components/admin/AdminUi";
import { PARTNER_TYPE_LABELS, type PartnerType } from "@/lib/partner-types";
import { packageLabel } from "@/lib/package-types";
import AssignPackageModal from "@/components/admin/AssignPackageModal";

interface PackageRow {
  id: string;
  user_id: string;
  tier: string;
  package_key: string | null;
  amount: number;
  status: string;
  effective_status: "active" | "expired" | "cancelled";
  started_at: string;
  expires_at: string | null;
  partner_type: string | null;
  notes: string;
  is_promotional: boolean;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
}

interface PackagesData {
  live: boolean;
  packages: PackageRow[];
  totals: {
    active: number;
    revenue: number;
    mostPopular: { label: string; count: number } | null;
    expiringSoon: number;
  };
}

const EXTEND_PRESETS = [7, 30, 90, 365] as const;

const statusTone = (status: PackageRow["effective_status"]) =>
  status === "active" ? "green" : status === "expired" ? "muted" : "red";

function daysLeftLabel(p: PackageRow): string {
  if (p.effective_status === "cancelled") return "—";
  if (!p.expires_at) return "No expiry";
  const diffMs = new Date(p.expires_at).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  return `${Math.ceil(diffMs / 86_400_000)}d`;
}

export default function PackagesClient() {
  const [data, setData] = useState<PackagesData | null>(null);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [extendingId, setExtendingId] = useState<string | null>(null);
  const [extendDays, setExtendDays] = useState<number>(30);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/packages")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch(() => setError("Could not load packages."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleExtend(id: string) {
    setActionLoadingId(id);
    setActionError("");
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "extend", days: extendDays }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || "Failed to extend package");
      }
      setExtendingId(null);
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to extend package");
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this package? This downgrades the user to Free immediately.")) return;
    setActionLoadingId(id);
    setActionError("");
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "cancel" }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => null);
        throw new Error(d?.error || "Failed to cancel package");
      }
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to cancel package");
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Packages</h1>
          <p className="mt-1 text-sm opacity-60">
            Paid and promotional packages assigned to users and partners.
          </p>
        </div>
        <button
          onClick={() => setAssigning(true)}
          className="flex items-center gap-1.5 rounded-md bg-amber px-4 py-2 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          <Plus size={18} />
          Assign Package
        </button>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {!error && !data && <LoadingState label="Loading packages…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Active Packages"
              value={data.totals.active.toLocaleString("en-IN")}
              sub="Currently active"
              icon={PackageCheck}
            />
            <StatCard
              label="Revenue"
              value={formatINR(data.totals.revenue)}
              sub="From paid packages"
              icon={IndianRupee}
            />
            <StatCard
              label="Most Popular"
              value={data.totals.mostPopular?.label ?? "—"}
              sub={
                data.totals.mostPopular
                  ? `${data.totals.mostPopular.count} assigned`
                  : "No packages yet"
              }
              icon={Gift}
            />
            <StatCard
              label="Expiring Soon"
              value={data.totals.expiringSoon.toLocaleString("en-IN")}
              sub="Within 7 days"
              icon={Clock}
            />
          </div>

          {actionError && (
            <div className="mt-4">
              <ErrorState message={actionError} />
            </div>
          )}

          <div className="mt-6">
            <SectionCard title="All packages" icon={PackageCheck}>
              {data.packages.length === 0 ? (
                <p className="text-sm text-muted">No packages assigned yet.</p>
              ) : (
                <DataTable
                  head={
                    <>
                      <Th>Date</Th>
                      <Th>User</Th>
                      <Th>Package</Th>
                      <Th>Partner Type</Th>
                      <Th>Notes</Th>
                      <Th>Amount</Th>
                      <Th>Expiry</Th>
                      <Th>Days left</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </>
                  }
                >
                  {data.packages.map((p) => (
                    <tr key={p.id} className="border-b border-line align-top last:border-b-0">
                      <Td>{fmtDate(p.created_at)}</Td>
                      <Td>
                        <span className="font-medium text-navy">{p.user_name || "Unnamed"}</span>
                        <span className="block text-xs text-muted">{p.user_email || "—"}</span>
                      </Td>
                      <Td>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge tone="green">{packageLabel(p.package_key, p.tier)}</Badge>
                          <Badge tone={p.is_promotional ? "amber" : "muted"}>
                            {p.is_promotional ? "Promotional" : "Paid"}
                          </Badge>
                        </div>
                      </Td>
                      <Td>
                        {p.partner_type ? (
                          PARTNER_TYPE_LABELS[p.partner_type as PartnerType] ?? p.partner_type
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </Td>
                      <Td className="max-w-[220px]">
                        <span className="block whitespace-pre-wrap break-words text-ink/80">
                          {p.notes || "—"}
                        </span>
                      </Td>
                      <Td>{p.is_promotional ? "Free" : formatINR(Number(p.amount) || 0)}</Td>
                      <Td>{fmtDate(p.expires_at)}</Td>
                      <Td>{daysLeftLabel(p)}</Td>
                      <Td>
                        <Badge tone={statusTone(p.effective_status)}>{p.effective_status}</Badge>
                      </Td>
                      <Td>
                        {p.effective_status === "cancelled" ? (
                          <span className="text-muted">—</span>
                        ) : extendingId === p.id ? (
                          <div className="flex items-center gap-1.5">
                            <select
                              value={extendDays}
                              onChange={(e) => setExtendDays(Number(e.target.value))}
                              className="rounded-md border border-line bg-white px-2 py-1 text-xs"
                            >
                              {EXTEND_PRESETS.map((d) => (
                                <option key={d} value={d}>
                                  {d}d
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleExtend(p.id)}
                              disabled={actionLoadingId === p.id}
                              className="rounded-md bg-green px-2 py-1 text-xs font-semibold text-paper hover:bg-navy disabled:opacity-60"
                            >
                              {actionLoadingId === p.id ? "…" : "Confirm"}
                            </button>
                            <button
                              onClick={() => setExtendingId(null)}
                              className="text-xs font-semibold text-muted hover:text-navy"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => {
                                setExtendDays(30);
                                setExtendingId(p.id);
                              }}
                              className="rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-navy hover:border-green-bright"
                            >
                              Extend
                            </button>
                            <button
                              onClick={() => handleCancel(p.id)}
                              disabled={actionLoadingId === p.id}
                              className="rounded-md border border-line px-2.5 py-1 text-xs font-semibold text-red-700 hover:border-red-700 disabled:opacity-60"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </Td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </SectionCard>
          </div>
        </>
      )}

      {assigning && (
        <AssignPackageModal
          onClose={() => setAssigning(false)}
          onAssigned={load}
        />
      )}
    </div>
  );
}
