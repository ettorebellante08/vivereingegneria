"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitize";
import { pageBlocksSchema, type Block } from "@/lib/blocks/schema";

export type BlocksActionState = { error?: string; ok?: string } | undefined;

/** Persist a static page's block-based content. web_admin+ only (enforced
 * again by RLS at the DB layer). */
export async function saveStaticPageBlocks(
  slug: string,
  title: string,
  blocks: Block[],
): Promise<BlocksActionState> {
  const user = await requireRole("web_admin");

  if (!title.trim() || title.trim().length < 2) {
    return { error: "Il titolo non è valido." };
  }

  const parsed = pageBlocksSchema.safeParse({ blocks });
  if (!parsed.success) {
    return { error: "Il contenuto della pagina non è valido." };
  }

  // Sanitise rich-text sub-fields (paragraph HTML) before persisting.
  const sanitized = parsed.data.blocks.map((block) =>
    block.type === "paragraph"
      ? { ...block, html: sanitizeRichText(block.html) }
      : block,
  );

  const supabase = await createClient();
  const { error } = await supabase.from("static_pages").upsert(
    {
      slug,
      title: title.trim(),
      content_json: { blocks: sanitized },
      updated_by: user.id,
    },
    { onConflict: "slug" },
  );

  if (error) return { error: error.message };

  revalidatePath(`/${slug}`);
  revalidatePath("/dashboard/pagine");
  revalidatePath(`/dashboard/pagine/${slug}`);
  return { ok: "Pagina salvata." };
}
