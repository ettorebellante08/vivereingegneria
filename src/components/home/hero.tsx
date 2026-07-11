import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site-config";

/**
 * Light editorial masthead. Magazine-style: kicker, oversized Fraunces
 * headline, lead paragraph, and a framed pull-quote with the association's
 * motto. No dark surfaces, no pinned scroll — the tone is "beautiful blog".
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-32 sm:pb-24 sm:pt-40">
        {/* Masthead metadata line */}
        <div className="vi-rise flex items-center justify-between gap-4 border-b border-border pb-5 text-muted-foreground">
          <span className="eyebrow">Associazione studentesca</span>
          <span className="eyebrow hidden sm:inline">Ingegneria · UniPa</span>
          <span className="eyebrow">Dal {SITE.foundedYear}</span>
        </div>

        <div className="grid gap-12 pt-12 lg:grid-cols-[1.35fr_1fr] lg:items-end lg:gap-16">
          {/* Headline */}
          <div>
            <h1
              className="vi-rise text-balance text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.98]"
              style={{ animationDelay: "0.05s" }}
            >
              Vivere{" "}
              <span className="italic text-primary">l&apos;Ingegneria</span>,
              insieme.
            </h1>
            <p
              className="vi-rise mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "0.15s" }}
            >
              {SITE.description}
            </p>
            <div
              className="vi-rise mt-10 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.25s" }}
            >
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-700"
              >
                Leggi il blog
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/chi-siamo"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                Chi siamo
              </Link>
            </div>
          </div>

          {/* Pull-quote card */}
          <figure
            className="vi-rise relative rounded-2xl border border-border bg-card p-8 shadow-[0_1px_0_rgba(0,0,0,0.02),0_20px_40px_-24px_rgba(7,29,153,0.25)]"
            style={{ animationDelay: "0.35s" }}
          >
            <span className="font-display text-6xl leading-none text-primary/25">
              “
            </span>
            <blockquote className="-mt-6 font-display text-2xl leading-snug">
              Dato che non c&apos;è niente, noi vogliamo rimboccarci le maniche e
              costruire qualche cosa.
            </blockquote>
            <figcaption className="mt-6 eyebrow text-muted-foreground">
              Il nostro spirito, dal {SITE.foundedYear}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
