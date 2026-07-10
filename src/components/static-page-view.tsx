import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";
import { Prose } from "@/components/prose";
import { getStaticPage } from "@/lib/data/pages";

/**
 * Server component that renders a DB-backed (with default fallback) static
 * page by slug. Used by the thin route files under src/app.
 */
export async function StaticPageView({ slug }: { slug: string }) {
  const page = await getStaticPage(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader title={page.title} description={page.description} />
      <div className="mx-auto mt-12 max-w-3xl">
        {page.needsContent && (
          <PlaceholderNote>
            <p>
              Questi contenuti non erano recuperabili dal vecchio sito e vanno
              inseriti dall&apos;area riservata.
              {page.missing ? ` Mancano: ${page.missing}` : null}
            </p>
          </PlaceholderNote>
        )}
        <Prose html={page.bodyHtml} />
      </div>
    </div>
  );
}
