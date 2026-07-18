"use client";

import { useCallback, useEffect, useState } from "react";
import { LifeBuoy, Inbox, MailOpen, CheckCircle2 } from "lucide-react";
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
  fmtDate,
} from "@/components/admin/AdminUi";

interface Inquiry {
  id: string;
  source: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  inquiry_type: string | null;
  message: string;
  status: string;
  channel: string | null;
  created_at: string;
}

interface SupportData {
  live: boolean;
  inquiries: Inquiry[];
  total: number;
}

const STATUSES = ["new", "contacted", "closed"] as const;
const statusTone = (s: string) => (s === "new" ? "amber" : s === "contacted" ? "green" : "muted");

export default function SupportClient() {
  const [data, setData] = useState<SupportData | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch("/api/admin/support")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch(() => setError("Could not load support messages."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setStatus(inq: Inquiry, status: string) {
    // Optimistic: update the row locally, then persist.
    setData((prev) =>
      prev
        ? { ...prev, inquiries: prev.inquiries.map((i) => (i.id === inq.id ? { ...i, status } : i)) }
        : prev
    );
    try {
      const res = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: inq.id, status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("Could not update status.");
      load();
    }
  }

  const count = (s: string) => data?.inquiries.filter((i) => i.status === s).length ?? 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Support</h1>
        <p className="mt-1 text-sm opacity-60">
          Contact-form submissions and buyer &harr; seller inquiries.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {!error && !data && <LoadingState label="Loading messages…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total"
              value={data.total.toLocaleString("en-IN")}
              sub="All messages"
              icon={LifeBuoy}
            />
            <StatCard label="New" value={count("new").toLocaleString("en-IN")} icon={Inbox} />
            <StatCard
              label="Contacted"
              value={count("contacted").toLocaleString("en-IN")}
              icon={MailOpen}
            />
            <StatCard
              label="Closed"
              value={count("closed").toLocaleString("en-IN")}
              icon={CheckCircle2}
            />
          </div>

          <div className="mt-6">
            <SectionCard title="Inbox" icon={LifeBuoy}>
              {data.inquiries.length === 0 ? (
                <p className="text-sm text-muted">No messages yet.</p>
              ) : (
                <DataTable
                  head={
                    <>
                      <Th>Date</Th>
                      <Th>From</Th>
                      <Th>Type</Th>
                      <Th>Message</Th>
                      <Th>Status</Th>
                    </>
                  }
                >
                  {data.inquiries.map((i) => (
                    <tr key={i.id} className="border-b border-line align-top last:border-b-0">
                      <Td>{fmtDate(i.created_at)}</Td>
                      <Td>
                        <span className="font-medium text-navy">{i.name || "—"}</span>
                        <span className="block text-xs text-muted">
                          {i.email || i.phone || "no contact"}
                        </span>
                        <Badge tone={i.source === "contact_form" ? "muted" : "green"}>
                          {i.source === "contact_form" ? "contact form" : "buyer↔seller"}
                        </Badge>
                      </Td>
                      <Td>{i.inquiry_type || i.channel || "—"}</Td>
                      <Td className="max-w-[320px]">
                        <span className="block whitespace-pre-wrap break-words text-ink/80">
                          {i.message || "—"}
                        </span>
                      </Td>
                      <Td>
                        <select
                          value={i.status}
                          onChange={(e) => setStatus(i, e.target.value)}
                          className={`rounded-full border-0 px-2 py-1 text-xs font-semibold ${
                            statusTone(i.status) === "amber"
                              ? "bg-amber/20 text-amber-dark"
                              : statusTone(i.status) === "green"
                                ? "bg-green-pale text-green"
                                : "bg-line text-muted"
                          }`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Td>
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
