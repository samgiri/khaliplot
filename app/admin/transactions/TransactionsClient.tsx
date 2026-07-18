"use client";

import { useEffect, useState } from "react";
import { Wallet, KeyRound, CreditCard, IndianRupee } from "lucide-react";
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
  shortId,
} from "@/components/admin/AdminUi";

interface RevealRow {
  id: string;
  viewer_id: string;
  target_owner_id: string;
  plot_id: string;
  tier_used: string;
  created_at: string;
}

interface SubscriptionRow {
  id: string;
  user_id: string;
  tier: string;
  amount: number;
  status: string;
  started_at: string;
  expires_at: string | null;
  created_at: string;
}

interface TransactionsData {
  live: boolean;
  reveals: RevealRow[];
  subscriptions: SubscriptionRow[];
  totals: { reveals: number; paidReveals: number; subscriptions: number; revenue: number };
}

const tierTone = (tier: string) => (tier === "free" ? "muted" : "green");
const subStatusTone = (status: string) =>
  status === "active" ? "green" : status === "expired" ? "muted" : "amber";

export default function TransactionsClient() {
  const [data, setData] = useState<TransactionsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then(setData)
      .catch(() => setError("Could not load transactions."));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Transactions</h1>
        <p className="mt-1 text-sm opacity-60">Contact reveals and subscription purchases.</p>
      </div>

      {error && <ErrorState message={error} />}
      {!error && !data && <LoadingState label="Loading transactions…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Reveals"
              value={data.totals.reveals.toLocaleString("en-IN")}
              sub="All contact unlocks"
              icon={KeyRound}
            />
            <StatCard
              label="Paid Reveals"
              value={data.totals.paidReveals.toLocaleString("en-IN")}
              sub="Featured / boost tier"
              icon={Wallet}
            />
            <StatCard
              label="Subscriptions"
              value={data.totals.subscriptions.toLocaleString("en-IN")}
              sub="Plus purchases"
              icon={CreditCard}
            />
            <StatCard
              label="Revenue (est.)"
              value={formatINR(data.totals.revenue)}
              sub="Paid reveals × ₹499 + subs"
              icon={IndianRupee}
            />
          </div>

          <div className="mt-6 space-y-6">
            <SectionCard title="Recent reveals" icon={KeyRound}>
              {data.reveals.length === 0 ? (
                <p className="text-sm text-muted">No reveals yet.</p>
              ) : (
                <DataTable
                  head={
                    <>
                      <Th>Date</Th>
                      <Th>Tier</Th>
                      <Th>Plot</Th>
                      <Th>Viewer</Th>
                      <Th>Owner</Th>
                    </>
                  }
                >
                  {data.reveals.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-b-0">
                      <Td>{fmtDate(r.created_at)}</Td>
                      <Td>
                        <Badge tone={tierTone(r.tier_used)}>{r.tier_used}</Badge>
                      </Td>
                      <Td className="font-mono text-xs">{shortId(r.plot_id)}</Td>
                      <Td className="font-mono text-xs">{shortId(r.viewer_id)}</Td>
                      <Td className="font-mono text-xs">{shortId(r.target_owner_id)}</Td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </SectionCard>

            <SectionCard title="Subscriptions" icon={CreditCard}>
              {data.subscriptions.length === 0 ? (
                <p className="text-sm text-muted">
                  No subscription records yet — these populate once the Razorpay integration lands.
                </p>
              ) : (
                <DataTable
                  head={
                    <>
                      <Th>Date</Th>
                      <Th>Tier</Th>
                      <Th>Amount</Th>
                      <Th>Status</Th>
                      <Th>User</Th>
                    </>
                  }
                >
                  {data.subscriptions.map((s) => (
                    <tr key={s.id} className="border-b border-line last:border-b-0">
                      <Td>{fmtDate(s.created_at)}</Td>
                      <Td>
                        <Badge tone="green">{s.tier}</Badge>
                      </Td>
                      <Td>{formatINR(Number(s.amount) || 0)}</Td>
                      <Td>
                        <Badge tone={subStatusTone(s.status)}>{s.status}</Badge>
                      </Td>
                      <Td className="font-mono text-xs">{shortId(s.user_id)}</Td>
                    </tr>
                  ))}
                </DataTable>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </div>
  );
}
