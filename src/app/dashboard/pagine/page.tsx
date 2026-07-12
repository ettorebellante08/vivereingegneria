import Link from "next/link";
import { ArrowRight, Home as HomeIcon } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { STATIC_PAGES } from "@/content/pages";
import { getCourses } from "@/lib/data/courses";

export default async function PagesListPage() {
  await requireRole("web_admin");
  const pages = Object.values(STATIC_PAGES);
  const courses = await getCourses();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Pagine</h2>
        <p className="text-sm text-muted-foreground">
          Modifica i contenuti del sito con l&apos;editor visuale a blocchi.
        </p>
      </div>

      {/* Home */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Home
        </h3>
        <ul className="divide-y divide-border rounded-xl border border-border">
          <li>
            <Link
              href="/dashboard/home"
              className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <HomeIcon className="size-4 text-primary" />
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-xs text-muted-foreground">/</p>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        </ul>
      </section>

      {/* Institutional pages */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Pagine istituzionali
        </h3>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {pages.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/dashboard/pagine/${p.slug}`}
                className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">/{p.slug}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Courses */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Corsi di laurea
        </h3>
        <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
          {courses.map((c) => (
            <li key={c.slug} className="bg-background">
              <Link
                href={`/dashboard/corsi/${c.slug}`}
                className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent"
              >
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/corsi/{c.slug}</p>
                </div>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
