import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, dbConfigured } from "@/lib/admin-api";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET/POST/PUT/DELETE /api/admin/content — manage News articles (the write API
// the public news section has been waiting for). Backed by `news_articles`
// (schema_part2_5_news.sql). Unlike the public reader (lib/news-service.ts),
// this lists drafts too and writes through the service role.

const NEWS_COLUMNS = "id, slug, title, city_tag, excerpt, content, published, created_at";

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  city_tag: string | null;
  excerpt: string | null;
  content: string;
  published: boolean;
  created_at: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// GET — all articles (published + drafts), newest first.
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!dbConfigured()) {
    return NextResponse.json({ live: false, articles: [] });
  }

  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .select(NEWS_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ live: true, articles: (data ?? []) as NewsRow[] });
}

// POST — create an article. Body: { title, content, slug?, city_tag?, excerpt?, published? }.
export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(title);
  if (!slug) {
    return NextResponse.json({ error: "Could not derive a slug from the title" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .insert({
      slug,
      title,
      content,
      city_tag: typeof body.city_tag === "string" ? body.city_tag.trim() || null : null,
      excerpt: typeof body.excerpt === "string" ? body.excerpt.trim() || null : null,
      published: body.published !== false, // default to published
    })
    .select(NEWS_COLUMNS)
    .single();

  if (error) {
    // 23505 = unique_violation on the slug.
    const status = error.code === "23505" ? 409 : 500;
    const message = status === 409 ? "An article with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ article: data as NewsRow }, { status: 201 });
}

// PUT — update an article. Body must include id; any subset of the fields.
export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updates: Partial<Omit<NewsRow, "id" | "created_at">> = {};
  if (typeof body.title === "string") updates.title = body.title.trim();
  if (typeof body.content === "string") updates.content = body.content.trim();
  if (typeof body.slug === "string" && body.slug.trim()) updates.slug = slugify(body.slug);
  if (body.city_tag !== undefined)
    updates.city_tag = typeof body.city_tag === "string" ? body.city_tag.trim() || null : null;
  if (body.excerpt !== undefined)
    updates.excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() || null : null;
  if (typeof body.published === "boolean") updates.published = body.published;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .update(updates)
    .eq("id", body.id)
    .select(NEWS_COLUMNS)
    .single();

  if (error) {
    const status = error.code === "23505" ? 409 : 500;
    const message = status === 409 ? "An article with this slug already exists" : error.message;
    return NextResponse.json({ error: message }, { status });
  }

  return NextResponse.json({ article: data as NewsRow });
}

// DELETE /api/admin/content?id=xxx — remove an article.
export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from("news_articles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
