import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { STATIC_PAGES, type StaticPageContent } from "@/content/pages";
import { parseBlocks, type Block } from "@/lib/blocks/schema";

export type ResolvedStaticPage = StaticPageContent & {
  /** Block-based content (preferred). When present and non-empty, the page
   * renders via <BlockRenderer> instead of the legacy bodyHtml/<Prose>. */
  blocks?: Block[];
};

/**
 * Resolve a static page's content: prefer the DB (editable by web_admin),
 * fall back to the bundled default when Supabase is not linked or the row
 * doesn't exist yet.
 */
export async function getStaticPage(
  slug: string,
): Promise<ResolvedStaticPage | null> {
  const fallback = STATIC_PAGES[slug] ?? null;

  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("static_pages")
      .select("title, content_html, content_json")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return fallback;

    const blocks = data.content_json ? parseBlocks(data.content_json) : [];
    if (blocks.length > 0) {
      return {
        slug,
        title: data.title ?? fallback?.title ?? slug,
        description: fallback?.description ?? "",
        bodyHtml: "",
        blocks,
        needsContent: false,
      };
    }

    if (data.content_html) {
      return {
        slug,
        title: data.title ?? fallback?.title ?? slug,
        description: fallback?.description ?? "",
        bodyHtml: data.content_html,
        needsContent: false,
      };
    }
  } catch {
    // Network/permission error — degrade gracefully to the default.
  }

  return fallback;
}
