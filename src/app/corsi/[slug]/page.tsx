import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PlaceholderNote } from "@/components/placeholder-note";
import { getCourse, getCourses } from "@/lib/data/courses";

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
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-40">
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

      <div className="mx-auto mt-12 max-w-3xl">
        <PlaceholderNote>
          <p>
            Contenuti specifici del corso da inserire dall&apos;area riservata:
            rappresentanti del corso, gruppi Telegram/Facebook, materiali,
            avvisi e link utili dedicati.
          </p>
        </PlaceholderNote>
      </div>
    </div>
  );
}
