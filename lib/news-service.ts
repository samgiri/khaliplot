import { supabase } from "./supabase";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  cityTag: string | null;
  excerpt: string | null;
  content: string;
  createdAt: string;
}

const NEWS_COLUMNS = "id, slug, title, city_tag, excerpt, content, created_at";

interface NewsArticleRow {
  id: string;
  slug: string;
  title: string;
  city_tag: string | null;
  excerpt: string | null;
  content: string;
  created_at: string;
}

function rowToArticle(row: NewsArticleRow): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    cityTag: row.city_tag,
    excerpt: row.excerpt,
    content: row.content,
    createdAt: row.created_at,
  };
}

/**
 * Published articles, newest first. Falls back to the bundled launch articles
 * (lib/news-seed) when Supabase isn't configured or the table is empty, so the
 * News section is always populated.
 */
export async function getPublishedArticles(): Promise<NewsArticle[]> {
  const { seedArticles } = await import("@/lib/news-seed");

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return seedArticles;
  }

  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select(NEWS_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return seedArticles;
    }

    return (data as unknown as NewsArticleRow[]).map(rowToArticle);
  } catch {
    return seedArticles;
  }
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const { findSeedArticle } = await import("@/lib/news-seed");

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return findSeedArticle(slug);
  }

  try {
    const { data, error } = await supabase
      .from("news_articles")
      .select(NEWS_COLUMNS)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) {
      return findSeedArticle(slug);
    }

    return rowToArticle(data as unknown as NewsArticleRow);
  } catch {
    return findSeedArticle(slug);
  }
}
