import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { getCourse, getCourses } from "@/lib/data/courses";
import { getPageBlocks } from "@/lib/data/pages";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { courseStorageSlug } from "@/lib/blocks/paths";
import { GALLERY_PHOTOS } from "@/content/gallery";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: course?.name ?? "Corso" };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, blocks] = await Promise.all([
    getCourse(slug),
    getPageBlocks(courseStorageSlug(slug)),
  ]);
  if (!course) notFound();

  const hasBlocks = blocks.length > 0;
  const [posts, courses] = hasBlocks
    ? await Promise.all([getPublishedPosts(), getCourses()])
    : [[], []];

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/corsi"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Tutti i corsi
        </Link>

        <PageHeader
          eyebrow="Corso di Laurea"
          title={course.name}
          description={course.description ?? undefined}
        />
      </div>

      {hasBlocks ? (
        <div className="mt-14">
          <BlockRenderer
            blocks={blocks}
            data={{ posts, courses, galleryPhotos: GALLERY_PHOTOS, formatDate }}
          />
        </div>
      ) : (
        <div className="mx-auto mt-12 max-w-3xl px-6">
          <PlaceholderNote>
            <p>
              Contenuti specifici del corso da inserire dall&apos;area riservata:
              rappresentanti del corso, gruppi Telegram/Facebook, materiali,
              avvisi e link utili dedicati.
            </p>
          </PlaceholderNote>
        </div>
      )}
    </div>
  );
}
