"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site-config";

/**
 * Light editorial masthead. The logo IS the headline — no wordmark text —
 * with a soft brand-blue glow that breathes behind it and a gentle parallax
 * on scroll for a sense of depth. No dark surfaces.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 40]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-border"
    >
      {/* Breathing brand-blue glow behind the logo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_16%,transparent),transparent)]"
        style={{ animation: reduce ? undefined : "vi-breathe 7s ease-in-out infinite" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 text-center sm:pb-28 sm:pt-40">
        <p
          className="vi-rise eyebrow text-muted-foreground"
          style={{ animationDelay: "0.05s" }}
        >
          Associazione studentesca · Dal {SITE.foundedYear}
        </p>

        <div
          className="vi-pop mx-auto mt-10 w-full max-w-2xl"
          style={{ animationDelay: "0.1s" }}
        >
          <motion.img
            src="/brand/logo-full.svg"
            alt="Vivere Ingegneria"
            style={{ y: logoY, opacity: logoOpacity }}
            className="w-full"
          />
        </div>

        <p
          className="vi-rise mx-auto mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground"
          style={{ animationDelay: "0.2s" }}
        >
          {SITE.description}
        </p>

        <div
          className="vi-rise mt-10 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
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
    </section>
  );
}
