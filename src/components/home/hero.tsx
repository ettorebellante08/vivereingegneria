"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * Light editorial masthead. The logo IS the headline — no wordmark text —
 * over a slow drifting brand-blue gradient mesh, with a glow that tracks the
 * cursor and a gentle parallax on scroll. Light surfaces only.
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

  // Cursor-reactive glow.
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const gx = useSpring(mx, { stiffness: 60, damping: 20 });
  const gy = useSpring(my, { stiffness: 60, damping: 20 });
  const glow = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(38rem 38rem at ${x}% ${y}%, color-mix(in srgb, var(--primary) 14%, transparent), transparent 70%)`,
  );

  function handleMove(e: React.MouseEvent<HTMLElement>) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative overflow-hidden border-b border-border"
    >
      {/* Drifting gradient-mesh blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-32 top-0 size-[34rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--brand-400)_22%,transparent),transparent)] blur-2xl"
          style={{ animation: reduce ? undefined : "vi-drift-a 18s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-24 bottom-0 size-[30rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_18%,transparent),transparent)] blur-2xl"
          style={{ animation: reduce ? undefined : "vi-drift-b 22s ease-in-out infinite" }}
        />
      </div>

      {/* Cursor-reactive glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: reduce ? undefined : glow }}
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
            className="w-full drop-shadow-[0_8px_30px_rgba(7,29,153,0.08)]"
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
          <Magnetic>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              Leggi il blog
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Link
            href="/chi-siamo"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
          >
            Chi siamo
          </Link>
        </div>

        {/* Scroll cue */}
        <div
          className="vi-rise mt-16 flex justify-center"
          style={{ animationDelay: "0.45s" }}
        >
          <span
            aria-hidden
            className="flex h-10 w-6 items-start justify-center rounded-full border border-foreground/20 p-1.5"
          >
            <span
              className="h-2 w-1 rounded-full bg-primary"
              style={{ animation: reduce ? undefined : "vi-scroll-cue 1.8s ease-in-out infinite" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}
