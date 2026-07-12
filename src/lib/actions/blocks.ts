"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitize";
import { pageBlocksSchema, type Block } from "@/lib/blocks/schema";
import { publicPathForSlug } from "@/lib/blocks/paths";

export type BlocksActionState = { error?: string; ok?: string } | undefined;

/** Sanitise every rich-text (paragraph) sub-field, including blocks nested in
 * section columns. Everything else is rendered as plain text. */
function sanitizeBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => {
    if (block.type === "paragraph") {
      return { ...block, html: sanitizeRichText(block.html) };
    }
    if (block.type === "section") {
      return {
        ...block,
        columns: block.columns.map((col) => ({
          ...col,
          blocks: col.blocks.map((lb) =>
            lb.type === "paragraph" ? { ...lb, html: sanitizeRichText(lb.html) } : lb,
          ),
        })),
      };
    }
    return block;
  });
}

/** Persist a page's block-based content. Works for institutional pages and the
 * reserved `home` / `corso:<slug>` documents. web_admin+ only (re-checked by
 * RLS at the DB layer). */
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

  const sanitized = sanitizeBlocks(parsed.data.blocks);

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

  revalidatePath(publicPathForSlug(slug));
  revalidatePath("/dashboard/pagine");
  return { ok: "Pagina salvata." };
}
