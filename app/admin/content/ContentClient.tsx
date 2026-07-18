"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Eye, EyeOff, Trash2 } from "lucide-react";
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

interface Article {
  id: string;
  slug: string;
  title: string;
  city_tag: string | null;
  excerpt: string | null;
  content: string;
  published: boolean;
  created_at: string;
}

interface ContentData {
  live: boolean;
  articles: Article[];
}

export default function ContentClient() {
  const [data, setData] = useState<ContentData | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/content")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("request failed"))))
      .then((d) => {
        setData(d);
        setError("");
      })
      .catch(() => setError("Could not load content."));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function togglePublished(a: Article) {
    setBusyId(a.id);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, published: !a.published }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setError("Could not update the article.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(a: Article) {
    if (!confirm(`Delete “${a.title}”? This can't be undone.`)) return;
    setBusyId(a.id);
    try {
      const res = await fetch(`/api/admin/content?id=${encodeURIComponent(a.id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      setError("Could not delete the article.");
    } finally {
      setBusyId(null);
    }
  }

  const published = data?.articles.filter((a) => a.published).length ?? 0;
  const drafts = (data?.articles.length ?? 0) - published;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Content</h1>
        <p className="mt-1 text-sm opacity-60">News articles — publish, unpublish or remove.</p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorState message={error} />
        </div>
      )}
      {!error && !data && <LoadingState label="Loading content…" />}

      {data && (
        <>
          {!data.live && <SampleDataBanner />}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Articles"
              value={data.articles.length.toLocaleString("en-IN")}
              sub="Total"
              icon={FileText}
            />
            <StatCard label="Published" value={published.toLocaleString("en-IN")} icon={Eye} />
            <StatCard label="Drafts" value={drafts.toLocaleString("en-IN")} icon={EyeOff} />
          </div>

          <div className="mt-6">
            <SectionCard title="News articles" icon={FileText}>
              {data.articles.length === 0 ? (
                <p className="text-sm text-muted">No articles yet.</p>
              ) : (
                <DataTable
                  head={
                    <>
                      <Th>Title</Th>
                      <Th>City</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th>Actions</Th>
                    </>
                  }
                >
                  {data.articles.map((a) => (
                    <tr key={a.id} className="border-b border-line last:border-b-0">
                      <Td className="max-w-[280px]">
                        <span className="font-medium text-navy">{a.title}</span>
                        <span className="block truncate text-xs text-muted">/{a.slug}</span>
                      </Td>
                      <Td>{a.city_tag || "—"}</Td>
                      <Td>
                        {a.published ? (
                          <Badge tone="green">Published</Badge>
                        ) : (
                          <Badge tone="amber">Draft</Badge>
                        )}
                      </Td>
                      <Td>{fmtDate(a.created_at)}</Td>
                      <Td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePublished(a)}
                            disabled={busyId === a.id}
                            aria-label={a.published ? "Unpublish" : "Publish"}
                            title={a.published ? "Unpublish" : "Publish"}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line hover:border-green-bright disabled:opacity-50"
                          >
                            {a.published ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => remove(a)}
                            disabled={busyId === a.id}
                            aria-label="Delete"
                            title="Delete"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-amber-dark hover:border-amber-dark disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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
