import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { getCourses } from "@/lib/data/courses";
import { getPageBlocks } from "@/lib/data/pages";
import { Hero } from "@/components/home/hero";
import { PhotoGallery, PhotoCover } from "@/components/home/photo-gallery";
import { GALLERY_PHOTOS, GALLERY_COVER } from "@/content/gallery";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Magnetic } from "@/components/motion/magnetic";
import { HOME_SLUG } from "@/lib/blocks/paths";

export const revalidate = 60;

const highlights = [
  {
    n: "01",
    title: "Rappresentanza",
    text: "Portiamo la voce degli studenti negli organi che decidono la vita accademica.",
    href: "/rappresentanza",
    img: "/gallery/evento-01.jpg",
  },
  {
    n: "02",
    title: "Attività",
    text: "Seminari, gruppi di studio, orientamento al lavoro ed eventi per la community.",
    href: "/attivita",
    img: "/gallery/evento-03.jpg",
  },
  {
    n: "03",
    title: "Il mio corso",
    text: "14 Corsi di Laurea, ognuno con i suoi rappresentanti e le sue risorse.",
    href: "/corsi",
    img: "/gallery/evento-06.jpg",
  },
];

export default async function Home() {
  const [posts, courses, homeBlocks] = await Promise.all([
    getPublishedPosts(),
    getCourses(),
    getPageBlocks(HOME_SLUG),
  ]);
  const [featured, ...rest] = posts;
  const secondary = rest.slice(0, 4);
  const yearsActive = new Date().getFullYear() - SITE.foundedYear;

  return (
    <>
      <Hero />

      {/* Photo cover band — the association, as a backdrop */}
      <section className="container-page pb-16 pt-10 sm:pb-20">
        <Reveal>
          <PhotoCover
            photo={GALLERY_COVER}
            eyebrow="I nostri momenti"
            title="La vita di Vivere Ingegneria"
            subtitle="Consigli, seminari, eventi e le persone che li rendono possibili."
          />
        </Reveal>
      </section>

      {/* Photo mosaic */}
      {GALLERY_PHOTOS.length > 0 && (
        <section className="container-page pb-20 sm:pb-28">
          <PhotoGallery photos={GALLERY_PHOTOS} />
        </section>
      )}

      {/* Editable zone — custom blocks composed from the dashboard (Home) */}
      {homeBlocks.length > 0 && (
        <section className="pb-4">
          <BlockRenderer
            blocks={homeBlocks}
            data={{ posts, courses, galleryPhotos: GALLERY_PHOTOS, formatDate }}
          />
        </section>
      )}

      {/* From the blog — the centrepiece */}
      <section className="section container-page">
        <Reveal className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow text-primary">Dal blog</p>
            <h2 className="mt-3 text-display-lg">Ultimi articoli</h2>
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
            <p className="text-display-md">Il blog riparte da zero.</p>
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
                <div className="overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
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
        <div className="section container-page">
          <Reveal>
            <p className="eyebrow text-primary">Cosa facciamo</p>
            <h2 className="mt-3 max-w-2xl text-balance text-display-lg">
              Tre modi di essere presenti, ogni giorno.
            </h2>
          </Reveal>

          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-3">
            {highlights.map((h) => (
              <RevealItem key={h.href}>
                <Link
                  href={h.href}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-6 text-white shadow-md ring-1 ring-black/5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:aspect-[3/4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={h.img}
                    alt=""
                    className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050a2e]/92 via-[#071d99]/45 to-transparent transition-opacity duration-500 group-hover:from-[#050a2e]/95"
                  />
                  <span className="accent-serif text-3xl text-white/75 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {h.n}
                  </span>
                  <h3 className="mt-2 flex items-center gap-2 text-2xl text-white">
                    {h.title}
                    <ArrowUpRight className="size-5 text-white/70 transition-all group-hover:translate-x-0.5 group-hover:text-white" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    {h.text}
                  </p>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Numbers */}
      <section className="section container-page">
        <RevealGroup className="grid gap-10 border-y border-border py-14 sm:grid-cols-3">
          <RevealItem className="text-center sm:text-left">
            <div className="accent-serif text-6xl text-primary sm:text-7xl">
              <Counter value={yearsActive} suffix="+" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">anni di attività</p>
          </RevealItem>
          <RevealItem className="text-center sm:text-left">
            <div className="accent-serif text-6xl text-primary sm:text-7xl">
              <Counter value={14} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">corsi di laurea</p>
          </RevealItem>
          <RevealItem className="text-center sm:text-left">
            <div className="accent-serif text-6xl text-primary sm:text-7xl">
              <Counter value={posts.length} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              articoli pubblicati
            </p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* Courses */}
      <section className="section container-page">
        <Reveal className="flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow text-primary">I 14 corsi</p>
            <h2 className="mt-3 text-display-lg">Trova il tuo corso</h2>
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
                className="group -mx-3 flex items-center justify-between gap-3 rounded-lg border-b border-border px-3 py-4 transition-all hover:border-transparent hover:bg-secondary/70 hover:text-primary"
              >
                <span className="text-lg">{c.name}</span>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* CTA */}
      <section className="container-page pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-secondary px-8 py-16 text-center shadow-lg sm:px-16">
            {/* soft brand glow, decorative */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_16%,transparent),transparent)] blur-2xl"
            />
            <h2 className="relative mx-auto max-w-2xl text-balance text-display-lg">
              Vuoi far parte di Vivere Ingegneria?
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
              Scrivici o passa a trovarci: c&apos;è sempre qualcosa da costruire
              insieme.
            </p>
            <Magnetic className="relative mt-8 inline-block">
              <Link
                href="/contatti"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-700"
              >
                Contattaci{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
