"use client";

import { useCallback, useEffect, useState } from "react";
import { PackageCheck, Gift, IndianRupee, Plus } from "lucide-react";
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
import AssignPackageModal from "@/components/admin/AssignPackageModal";

interface PackageRow {
  id: string;
  user_id: string;
  tier: string;
  amount: number;
  status: string;
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
  totals: { total: number; promotional: number; paid: number; revenue: number };
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const statusTone = (status: string) =>
  status === "active" ? "green" : status === "expired" ? "muted" : "amber";

export default function PackagesClient() {
  const [data, setData] = useState<PackagesData | null>(null);
  const [error, setError] = useState("");
  const [assigning, setAssigning] = useState(false);

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
              label="Total Packages"
              value={data.totals.total.toLocaleString("en-IN")}
              sub="All assigned"
              icon={PackageCheck}
            />
            <StatCard
              label="Promotional"
              value={data.totals.promotional.toLocaleString("en-IN")}
              sub="Free partner packages"
              icon={Gift}
            />
            <StatCard
              label="Paid"
              value={data.totals.paid.toLocaleString("en-IN")}
              sub="Paid packages"
              icon={PackageCheck}
            />
            <StatCard
              label="Revenue"
              value={formatINR(data.totals.revenue)}
              sub="From paid packages"
              icon={IndianRupee}
            />
          </div>

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
                      <Th>Status</Th>
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
                          <Badge tone="green">{titleCase(p.tier)}</Badge>
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
                      <Td className="max-w-[280px]">
                        <span className="block whitespace-pre-wrap break-words text-ink/80">
                          {p.notes || "—"}
                        </span>
                      </Td>
                      <Td>{p.is_promotional ? "Free" : formatINR(Number(p.amount) || 0)}</Td>
                      <Td>
                        <Badge tone={statusTone(p.status)}>{p.status}</Badge>
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
