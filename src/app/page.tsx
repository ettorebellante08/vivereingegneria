import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { getCourses } from "@/lib/data/courses";
import { Hero } from "@/components/home/hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

export const revalidate = 60;

const highlights = [
  {
    n: "01",
    title: "Rappresentanza",
    text: "Portiamo la voce degli studenti negli organi che decidono la vita accademica.",
    href: "/rappresentanza",
  },
  {
    n: "02",
    title: "Attività",
    text: "Seminari, gruppi di studio, orientamento al lavoro ed eventi per la community.",
    href: "/attivita",
  },
  {
    n: "03",
    title: "Il mio corso",
    text: "14 Corsi di Laurea, ognuno con i suoi rappresentanti e le sue risorse.",
    href: "/corsi",
  },
];

export default async function Home() {
  const [posts, courses] = await Promise.all([
    getPublishedPosts(),
    getCourses(),
  ]);
  const [featured, ...rest] = posts;
  const secondary = rest.slice(0, 4);

  return (
    <>
      <Hero />

      {/* From the blog — the centrepiece */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow text-primary">Dal blog</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Ultimi articoli</h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Tutti gli articoli <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        {!featured ? (
          <Reveal className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <p className="font-display text-2xl">Il blog riparte da zero.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              I primi articoli — resoconti dei Consigli, aggiornamenti sulla
              rappresentanza e racconti delle attività — arriveranno presto.
            </p>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            {/* Featured */}
            <Reveal>
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className="overflow-hidden rounded-2xl border border-border">
                  {featured.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.cover_url}
                      alt=""
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-800 to-brand-500" />
                  )}
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {formatDate(featured.published_at)}
                  {featured.author_name && <span>· {featured.author_name}</span>}
                </div>
                <h3 className="mt-3 text-balance text-3xl leading-tight group-hover:text-primary sm:text-4xl">
                  {featured.title}
                </h3>
                {featured.excerpt && (
                  <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>
                )}
              </Link>
            </Reveal>

            {/* Secondary list */}
            <RevealGroup className="flex flex-col divide-y divide-border">
              {secondary.map((post) => (
                <RevealItem key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col gap-1 py-5 first:pt-0"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.published_at)}
                    </div>
                    <h3 className="text-xl leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        )}
      </section>

      {/* What we do */}
      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Reveal>
            <p className="eyebrow text-primary">Cosa facciamo</p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl leading-tight sm:text-5xl">
              Tre modi di essere presenti, ogni giorno.
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-3">
            {highlights.map((h) => (
              <RevealItem key={h.href}>
                <Link href={h.href} className="group block border-t border-foreground/15 pt-6">
                  <span className="font-display text-2xl text-primary">{h.n}</span>
                  <h3 className="mt-4 flex items-center gap-2 text-2xl">
                    {h.title}
                    <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.text}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Courses */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <Reveal className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow text-primary">I 14 corsi</p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Trova il tuo corso</h2>
          </div>
          <Link
            href="/corsi"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Tutti i corsi <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <RevealItem key={c.slug}>
              <Link
                href={`/corsi/${c.slug}`}
                className="group flex items-center justify-between gap-3 border-b border-border py-4 transition-colors hover:text-primary"
              >
                <span className="text-lg">{c.name}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <Reveal className="mx-auto max-w-6xl">
          <div className="rounded-[1.75rem] border border-border bg-secondary px-8 py-16 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl leading-tight sm:text-5xl">
              Vuoi far parte di Vivere Ingegneria?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
              Scrivici o passa a trovarci: c&apos;è sempre qualcosa da costruire
              insieme.
            </p>
            <Link
              href="/contatti"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-700"
            >
              Contattaci <ArrowRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
