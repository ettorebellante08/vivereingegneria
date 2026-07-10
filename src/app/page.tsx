import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";
import { getCourses } from "@/lib/data/courses";
import { Hero } from "@/components/home/hero";
import { ScrollScenes, type Scene } from "@/components/motion/scroll-scenes";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Marquee } from "@/components/motion/marquee";

export const revalidate = 60;

const scenes: Scene[] = [
  {
    kicker: "01 — Rappresentanza",
    title: "La voce degli studenti, dove si decide.",
    text: "Sediamo negli organi accademici — CICS, Consiglio di Dipartimento — per difendere la didattica e i servizi di chi studia Ingegneria.",
    bg: "bg-[radial-gradient(80%_80%_at_30%_20%,#2f34e0,transparent_60%),linear-gradient(135deg,#071d99,#050a1f)]",
  },
  {
    kicker: "02 — Attività",
    title: "Seminari, progetti, occasioni.",
    text: "Formazione, gruppi di studio, orientamento al lavoro ed eventi che tengono viva la comunità di Ingegneria.",
    bg: "bg-[radial-gradient(80%_80%_at_70%_30%,#4453f5,transparent_55%),linear-gradient(135deg,#0a1a7a,#050a1f)]",
  },
  {
    kicker: "03 — Comunità",
    title: "Dal 2008, una cosa costruita insieme.",
    text: "«Dato che non c'è niente, noi vogliamo rimboccarci le maniche e costruire qualche cosa.»",
    bg: "bg-[radial-gradient(90%_90%_at_50%_80%,#2226bd,transparent_55%),linear-gradient(135deg,#071d99,#04081a)]",
  },
];

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
  const latest = posts.slice(0, 3);
  const yearsActive = new Date().getFullYear() - SITE.foundedYear;

  return (
    <>
      <Hero />

      {/* Cinematic pinned sequence */}
      <ScrollScenes scenes={scenes} />

      {/* What we do — editorial list */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <Reveal>
          <p className="eyebrow text-primary">Cosa facciamo</p>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl leading-tight sm:text-6xl">
            Tre modi di essere presenti, ogni giorno.
          </h2>
        </Reveal>

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {highlights.map((h) => (
            <RevealItem key={h.href}>
              <Link
                href={h.href}
                className="group flex h-full flex-col justify-between gap-16 bg-background p-8 transition-colors hover:bg-muted/50"
              >
                <span className="font-display text-2xl text-muted-foreground">
                  {h.n}
                </span>
                <div>
                  <h3 className="flex items-center gap-2 text-2xl">
                    {h.title}
                    <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.text}
                  </p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Courses marquee */}
      <section className="border-y border-border bg-muted/30 py-20">
        <Reveal className="mx-auto mb-10 max-w-6xl px-6">
          <p className="eyebrow text-primary">I 14 corsi</p>
        </Reveal>
        <Marquee speed={45} className="text-4xl sm:text-6xl">
          {courses.map((c) => (
            <Link
              key={c.slug}
              href={`/corsi/${c.slug}`}
              className="group flex items-center gap-8 font-display text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="italic">{c.name}</span>
              <span className="text-primary/40">✦</span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-28 sm:py-36">
        <div className="grid gap-12 sm:grid-cols-3">
          <Parallax distance={40}>
            <Stat value={`${yearsActive}+`} label="anni di attività" />
          </Parallax>
          <Parallax distance={70}>
            <Stat value="14" label="corsi di laurea" />
          </Parallax>
          <Parallax distance={40}>
            <Stat value="∞" label="idee da costruire" />
          </Parallax>
        </div>
      </section>

      {/* Latest posts */}
      <section className="mx-auto max-w-6xl px-6 pb-28 sm:pb-36">
        <Reveal className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary">Dal blog</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">Cosa succede in Ingegneria</h2>
          </div>
          <Link
            href="/blog"
            className="hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            Tutti gli articoli <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        {latest.length === 0 ? (
          <Reveal className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Il blog riparte da zero: i primi articoli arriveranno presto.
          </Reveal>
        ) : (
          <RevealGroup className="mt-12 grid gap-6 md:grid-cols-3">
            {latest.map((post) => (
              <RevealItem key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
                >
                  {post.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_url} alt="" className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-800 to-brand-500" />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl leading-snug group-hover:text-primary">
                      {post.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />
                      {formatDate(post.published_at)}
                    </div>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>

      {/* CTA */}
      <section className="px-6 pb-28">
        <Reveal className="mx-auto max-w-6xl">
          <div className="grain relative overflow-hidden rounded-[2rem] bg-[#050a1f] px-8 py-24 text-center text-white sm:px-16">
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_0%,rgba(68,83,245,0.45),transparent_60%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-4xl leading-tight sm:text-6xl">
                Vuoi far parte di Vivere Ingegneria?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-balance text-white/70">
                Scrivici o passa a trovarci: c&apos;è sempre qualcosa da
                costruire insieme.
              </p>
              <Link
                href="/contatti"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-[#050a1f] transition-transform hover:scale-[1.03]"
              >
                Contattaci <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-border pt-6">
      <div className="font-display text-6xl leading-none text-primary sm:text-7xl">
        {value}
      </div>
      <div className="mt-3 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
