import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SITE } from "@/lib/site-config";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";

export const revalidate = 60;

const highlights = [
  {
    title: "Rappresentanza",
    description:
      "Portiamo la voce degli studenti negli organi che decidono la vita accademica.",
    href: "/rappresentanza",
    Icon: Megaphone,
  },
  {
    title: "Attività",
    description:
      "Seminari, gruppi di studio, orientamento al lavoro ed eventi per la community.",
    href: "/attivita",
    Icon: Users,
  },
  {
    title: "Il mio corso",
    description:
      "14 Corsi di Laurea, ognuno con i suoi rappresentanti e le sue risorse.",
    href: "/corsi",
    Icon: GraduationCap,
  },
];

export default async function Home() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  const yearsActive = new Date().getFullYear() - SITE.foundedYear;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_0%,color-mix(in_srgb,var(--primary)_16%,transparent),transparent)]"
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              Dal {SITE.foundedYear} · Ingegneria · UniPa
            </span>
            <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.05] sm:text-6xl">
              {SITE.tagline}
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/chi-siamo">
                  Scopri chi siamo
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/corsi">Trova il tuo corso</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-sm items-center justify-center rounded-3xl border border-border bg-gradient-to-br from-brand-800 to-brand-600 lg:flex">
            <Logo
              variant="mark"
              withLink={false}
              className="h-40 brightness-0 invert dark:brightness-0 dark:invert"
            />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ title, description, href, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Approfondisci
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-3 sm:px-6">
          <Stat value={`${yearsActive}+`} label="anni di attività" />
          <Stat value="14" label="corsi di laurea" />
          <Stat value="1" label="grande comunità di Ingegneria" />
        </div>
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Dal blog</h2>
            <p className="mt-2 text-muted-foreground">
              Resoconti e novità dalla vita associativa.
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href="/blog">
              Tutti gli articoli
              <ArrowRight />
            </Link>
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Il blog riparte da zero: i primi articoli arriveranno presto.
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
                >
                  {post.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_url}
                      alt=""
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand-800 to-brand-600" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-semibold leading-snug group-hover:text-primary">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.published_at)}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-600 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="text-balance text-3xl font-bold sm:text-4xl">
            Vuoi far parte di Vivere Ingegneria?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-white/80">
            Scrivici o passa a trovarci: c&apos;è sempre qualcosa da costruire
            insieme.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contatti">Contattaci</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-bold text-primary sm:text-5xl">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
