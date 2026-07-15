import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft, ArrowRight, PenLine } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug, getPublishedArticles } from "@/lib/news-service";
import { cities } from "@/lib/data";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 60;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | KhaliPlot.in`,
    description: article.excerpt ?? article.title,
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const isSearchableCity =
    article.cityTag && (cities as readonly string[]).includes(article.cityTag);

  const related = (await getPublishedArticles())
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-green hover:text-navy"
      >
        <ArrowLeft size={16} />
        Back to news
      </Link>

      {article.cityTag && (
        <span className="inline-flex w-fit items-center rounded-full bg-green-pale px-2.5 py-1 text-xs font-semibold text-green">
          {article.cityTag}
        </span>
      )}
      <h1 className="mt-3 font-display text-2xl font-bold text-navy sm:text-4xl">
        {article.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
        <span className="flex items-center gap-1.5">
          <PenLine size={14} />
          By KhaliPlot Team
        </span>
        <span className="flex items-center gap-1.5">
          <CalendarDays size={14} />
          {formatDate(article.createdAt)}
        </span>
      </div>

      <div className="plot-divider my-8" />

      <article className="space-y-4 text-ink/80 [&_em]:text-sm [&_em]:text-muted [&_p]:leading-relaxed [&_strong]:text-navy">
        <ReactMarkdown
          components={{
            h1: (props) => <h2 className="mt-6 font-display text-xl font-bold text-navy" {...props} />,
            h2: (props) => <h2 className="mt-6 font-display text-xl font-bold text-navy" {...props} />,
            h3: (props) => <h3 className="mt-5 font-display text-lg font-semibold text-navy" {...props} />,
            p: (props) => <p {...props} />,
            a: (props) => <a className="font-semibold text-green hover:text-navy" {...props} />,
          }}
        >
          {article.content}
        </ReactMarkdown>
      </article>

      <div className="mt-8 border-t border-line pt-6">
        <ShareButtons title={article.title} />
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-lg font-bold text-navy">Related articles</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/news/${r.slug}`}
                className="plot-border plot-border-hover group flex flex-col gap-2 rounded-lg bg-white p-4 transition-shadow hover:shadow-md"
              >
                {r.cityTag && (
                  <span className="inline-flex w-fit items-center rounded-full bg-green-pale px-2 py-0.5 text-[11px] font-semibold text-green">
                    {r.cityTag}
                  </span>
                )}
                <h3 className="font-display text-sm font-semibold leading-snug text-navy group-hover:text-green">
                  {r.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 overflow-hidden rounded-xl border-2 border-navy bg-green-pale px-6 py-8 text-center shadow-[6px_6px_0_0_var(--color-navy)]">
        <p className="font-display text-lg font-semibold text-navy">
          {isSearchableCity
            ? `Looking for plots in ${article.cityTag}?`
            : "Looking for a plot?"}
        </p>
        <Link
          href={isSearchableCity ? `/search?city=${encodeURIComponent(article.cityTag!)}` : "/search"}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-amber px-6 py-3 font-semibold text-navy transition-colors hover:bg-navy hover:text-paper"
        >
          Browse plots <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
