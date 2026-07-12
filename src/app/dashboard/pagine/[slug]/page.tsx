import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { STATIC_PAGES } from "@/content/pages";
import { createBlock, parseBlocks, type Block } from "@/lib/blocks/schema";
import { publicPathForSlug } from "@/lib/blocks/paths";
import { VisualEditor } from "@/components/dashboard/visual-editor/visual-editor";

export default async function EditStaticPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole("web_admin");
  const { slug } = await params;

  const fallback = STATIC_PAGES[slug];
  if (!fallback) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("static_pages")
    .select("title, content_html, content_json")
    .eq("slug", slug)
    .maybeSingle();

  const existingBlocks = data?.content_json ? parseBlocks(data.content_json) : [];

  // Seed the editor: prefer saved blocks, then convert legacy HTML (either a
  // previously saved blob or the bundled scaffold) into a starting paragraph
  // block so admins never open a blank editor.
  const initialBlocks: Block[] =
    existingBlocks.length > 0
      ? existingBlocks
      : [
          {
            ...createBlock("paragraph"),
            html: data?.content_html?.trim() || fallback.bodyHtml,
          },
        ];
  const initialTitle = data?.title ?? fallback.title;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/pagine"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Pagine
      </Link>
      <div>
        <h2 className="text-xl font-semibold">Modifica: {fallback.title}</h2>
        <p className="text-sm text-muted-foreground">
          Pubblica su{" "}
          <Link href={`/${slug}`} className="text-primary hover:underline">
            /{slug}
          </Link>
        </p>
      </div>
      <VisualEditor
        slug={slug}
        publicPath={publicPathForSlug(slug)}
        initialTitle={initialTitle}
        initialBlocks={initialBlocks}
      />
    </div>
  );
}
