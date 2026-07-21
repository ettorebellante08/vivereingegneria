import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { getCourses } from "@/lib/data/courses";
import { getPageBlocks } from "@/lib/data/pages";
import { Hero } from "@/components/home/hero";
import { StoryScroll, type StoryChapter } from "@/components/home/story-scroll";
import { GALLERY_PHOTOS, GALLERY_COVER } from "@/content/gallery";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Magnetic } from "@/components/motion/magnetic";
import { HOME_SLUG } from "@/lib/blocks/paths";

export const revalidate = 60;

const CHAPTERS: StoryChapter[] = [
  {
    n: "01",
    eyebrow: "Rappresentanza",
    title: "La voce degli studenti, dove si decide.",
    text: "Portiamo le istanze degli studenti negli organi che governano la vita accademica: consigli, commissioni, tavoli di corso.",
    href: "/rappresentanza",
    cta: "La rappresentanza",
    photo: "/gallery/evento-01.jpg",
    alt: "Foto di gruppo nel corridoio della facoltà con lo striscione dell'associazione",
  },
  {
    n: "02",
    eyebrow: "Attività",
    title: "Si impara anche fuori dall'aula.",
    text: "Seminari, gruppi di studio, orientamento al lavoro ed eventi che tengono viva la community di Ingegneria.",
    href: "/attivita",
    cta: "Le attività",
    photo: "/gallery/evento-03.jpg",
    alt: "Festeggiamenti nel corridoio della facoltà con la torta di compleanno",
  },
  {
    n: "03",
    eyebrow: "Il mio corso",
    title: "Quattordici corsi, una comunità.",
    text: "Ogni Corso di Laurea ha i suoi rappresentanti e le sue risorse. Trova il tuo e resta in contatto con chi lo vive.",
    href: "/corsi",
    cta: "Trova il tuo corso",
    photo: "/gallery/evento-06.jpg",
    alt: "Foto di gruppo all'aperto tra gli alberi del campus",
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
      {/* Cinematic photo hero */}
      <Hero src={GALLERY_COVER.src} alt={GALLERY_COVER.alt} />

      {/* Manifesto — a breath of light after the hero */}
      <section className="section container-page">
        <Reveal>
          <p className="eyebrow text-primary">Chi siamo</p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-6 max-w-4xl text-balance text-3xl font-medium leading-snug tracking-tight text-foreground sm:text-4xl">
            {SITE.description}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Link
            href="/chi-siamo"
            className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            La nostra storia
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      {/* Pinned scroll storytelling — the three pillars */}
      <StoryScroll chapters={CHAPTERS} />

      {/* Numbers over a photograph */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-[#050a2e] py-24">
        <Image
          src="/gallery/evento-05.jpg"
          alt="Un momento conviviale della serata sotto i portici del campus"
          fill
          quality={70}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[#050a2e]/92 via-[#071d99]/70 to-[#050a2e]/92"
        />
        <div className="container-page relative">
          <Reveal>
            <p className="eyebrow text-white/70">In numeri</p>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-10 sm:grid-cols-3">
            <RevealItem>
              <div className="accent-serif text-7xl text-white sm:text-8xl">
                <Counter value={yearsActive} suffix="+" />
              </div>
              <p className="mt-2 text-sm text-white/70">anni di attività</p>
            </RevealItem>
            <RevealItem>
              <div className="accent-serif text-7xl text-white sm:text-8xl">
                <Counter value={14} />
              </div>
              <p className="mt-2 text-sm text-white/70">corsi di laurea</p>
            </RevealItem>
            <RevealItem>
              <div className="accent-serif text-7xl text-white sm:text-8xl">
                <Counter value={posts.length} />
              </div>
              <p className="mt-2 text-sm text-white/70">articoli pubblicati</p>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* Editable zone — custom blocks composed from the dashboard (Home) */}
      {homeBlocks.length > 0 && (
        <section className="pb-4">
          <BlockRenderer
            blocks={homeBlocks}
            data={{ posts, courses, galleryPhotos: GALLERY_PHOTOS, formatDate }}
          />
        </section>
      )}

      {/* From the blog */}
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
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
                  {featured.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.cover_url}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-brand-800 to-brand-500" />
                  )}
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {formatDate(featured.published_at)}
                  {featured.author_name && <span>· {featured.author_name}</span>}
                </div>
                <h3 className="mt-3 text-balance text-3xl leading-tight transition-colors group-hover:text-primary sm:text-4xl">
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

      {/* Immersive CTA over a photograph */}
      <section className="relative flex min-h-[70svh] items-center overflow-hidden bg-[#050a2e]">
        <Image
          src="/gallery/evento-04.jpg"
          alt="Il gruppo di Vivere Ingegneria in posa sotto il monumento con l'aereo"
          fill
          quality={70}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#050a2e]/94 via-[#050a2e]/60 to-[#050a2e]/80"
        />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-balance text-display-xl text-white">
              Vuoi far parte di Vivere Ingegneria?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-white/80">
              Scrivici o passa a trovarci: c&apos;è sempre qualcosa da costruire
              insieme.
            </p>
            <Magnetic className="mt-9 inline-block">
              <Link
                href="/contatti"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#050a2e] transition-transform hover:scale-[1.03]"
              >
                Contattaci
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </>
  );
}
