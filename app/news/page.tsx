import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { getPublishedArticles } from "@/lib/news-service";

export const revalidate = 60;

export const metadata = {
  title: "News & Insights | KhaliPlot.in",
  description:
    "Infrastructure news and \"why invest\" guides for India's fastest-growing plot markets — Navi Mumbai, Neemrana, Dholera and more.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const articles = await getPublishedArticles();

  const cityTags = Array.from(
    new Set(articles.map((a) => a.cityTag).filter((tag): tag is string => Boolean(tag)))
  );

  const filtered = city ? articles.filter((a) => a.cityTag === city) : articles;

  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="max-w-2xl">
        <p className="coord-label text-green">News &amp; insights</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          News, guides &amp; insights for plot buyers
        </h1>
        <p className="mt-3 text-ink/80">
          Buyer tips, land-document explainers, market reports and the story behind our
          ₹499 + ₹0 commission model.
        </p>
      </div>

      {cityTags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/news"
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              !city
                ? "border-green bg-green text-paper"
                : "border-line bg-white text-ink hover:border-green-bright"
            }`}
          >
            All
          </Link>
          {cityTags.map((tag) => (
            <Link
              key={tag}
              href={`/news?city=${encodeURIComponent(tag)}`}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                city === tag
                  ? "border-green bg-green text-paper"
                  : "border-line bg-white text-ink hover:border-green-bright"
              }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="plot-border plot-border-hover group flex flex-col gap-3 rounded-lg bg-white p-5 transition-shadow hover:shadow-md"
            >
              {article.cityTag && (
                <span className="inline-flex w-fit items-center rounded-full bg-green-pale px-2.5 py-1 text-xs font-semibold text-green">
                  {article.cityTag}
                </span>
              )}
              <h2 className="font-display text-lg font-semibold leading-snug text-navy group-hover:text-green">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-sm text-ink/70 line-clamp-3">{article.excerpt}</p>
              )}
              <p className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-muted">
                <CalendarDays size={13} />
                {formatDate(article.createdAt)}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="plot-border mt-10 rounded-lg bg-white p-12 text-center">
          <p className="font-display text-lg font-semibold text-navy">No articles yet</p>
          <p className="mt-2 text-sm text-muted">Check back soon for market news and insights.</p>
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 font-semibold text-green hover:text-navy"
        >
          Browse plots <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
