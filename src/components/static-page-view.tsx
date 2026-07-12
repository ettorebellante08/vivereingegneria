import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";
import { Prose } from "@/components/prose";
import { Reveal } from "@/components/motion/reveal";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getStaticPage } from "@/lib/data/pages";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { getCourses } from "@/lib/data/courses";
import { GALLERY_PHOTOS } from "@/content/gallery";

/**
 * Server component that renders a DB-backed (with default fallback) static
 * page by slug. Used by the thin route files under src/app.
 */
export async function StaticPageView({ slug }: { slug: string }) {
  const page = await getStaticPage(slug);
  if (!page) notFound();

  const hasBlocks = !!page.blocks && page.blocks.length > 0;

  // Only pay for the dynamic-block data when the page actually uses blocks.
  const [posts, courses] = hasBlocks
    ? await Promise.all([getPublishedPosts(), getCourses()])
    : [[], []];

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <PageHeader title={page.title} description={page.description} />
        </Reveal>
      </div>

      {page.needsContent && !hasBlocks && (
        <div className="mx-auto mt-16 max-w-3xl px-6">
          <Reveal>
            <PlaceholderNote>
              <p>
                Questi contenuti non erano recuperabili dal vecchio sito e vanno
                inseriti dall&apos;area riservata.
                {page.missing ? ` Mancano: ${page.missing}` : null}
              </p>
            </PlaceholderNote>
          </Reveal>
        </div>
      )}

      {hasBlocks ? (
        <div className="mt-14">
          <BlockRenderer
            blocks={page.blocks!}
            data={{ posts, courses, galleryPhotos: GALLERY_PHOTOS, formatDate }}
          />
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-3xl px-6">
          <Reveal>
            <Prose html={page.bodyHtml} />
          </Reveal>
        </div>
      )}
    </div>
  );
}
