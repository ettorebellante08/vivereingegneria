import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { STATIC_PAGES } from "@/content/pages";
import { StaticPageEditor } from "@/components/dashboard/static-page-editor";

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
    .select("title, content_html")
    .eq("slug", slug)
    .maybeSingle();

  // Prefill the bundled scaffold when the DB row has no content yet.
  const initialHtml = data?.content_html?.trim()
    ? data.content_html
    : fallback.bodyHtml;
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
      <StaticPageEditor
        slug={slug}
        initialTitle={initialTitle}
        initialHtml={initialHtml}
      />
    </div>
  );
}
