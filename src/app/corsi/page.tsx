import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCourses } from "@/lib/data/courses";

export const metadata: Metadata = {
  title: "Il mio corso",
  description:
    "I 14 Corsi di Laurea in Ingegneria: trova il tuo e le risorse dedicate.",
};

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <PageHeader
        eyebrow="Il mio corso"
        title="Trova il tuo corso"
        description="Ogni Corso di Laurea in Ingegneria ha i suoi rappresentanti, gruppi e risorse. Scegli il tuo per accedere alle informazioni dedicate."
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <li key={course.slug}>
            <Link
              href={`/corsi/${course.slug}`}
              className="group flex h-full items-center justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary hover:bg-accent"
            >
              <span className="font-medium">{course.name}</span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
