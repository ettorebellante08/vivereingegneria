import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type PostListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_url: string | null;
  published_at: string | null;
  author_name: string | null;
};

export type PostDetail = PostListItem & {
  content_html: string | null;
};

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Resolve author display names for a set of author ids in one query. */
async function authorNames(
  supabase: Supabase,
  ids: string[],
): Promise<Map<string, string | null>> {
  const map = new Map<string, string | null>();
  const unique = [...new Set(ids)];
  if (unique.length === 0) return map;

  // Read from the definer-rights `authors` view so anon can see names
  // without opening up the profiles table.
  const { data } = await supabase
    .from("authors")
    .select("id, full_name")
    .in("id", unique);

  for (const row of data ?? []) map.set(row.id, row.full_name);
  return map;
}

/** Published posts, newest first. Empty when Supabase isn't linked yet. */
export async function getPublishedPosts(): Promise<PostListItem[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_url, published_at, author_id")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const rows = data ?? [];
    const names = await authorNames(
      supabase,
      rows.map((r) => r.author_id),
    );

    return rows.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      cover_url: p.cover_url,
      published_at: p.published_at,
      author_name: names.get(p.author_id) ?? null,
    }));
  } catch {
    return [];
  }
}

export async function getPublishedPost(
  slug: string,
): Promise<PostDetail | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select(
        "id, title, slug, excerpt, cover_url, content_html, published_at, author_id",
      )
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!data) return null;
    const names = await authorNames(supabase, [data.author_id]);

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      cover_url: data.cover_url,
      content_html: data.content_html,
      published_at: data.published_at,
      author_name: names.get(data.author_id) ?? null,
    };
  } catch {
    return null;
  }
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
