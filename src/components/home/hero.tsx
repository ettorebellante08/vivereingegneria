"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { Magnetic } from "@/components/motion/magnetic";

/**
 * Cinematic full-bleed hero. A single atmospheric photograph fills the
 * viewport under a deep navy scrim, with an oversized typographic statement
 * laid over it. The image drifts (ken-burns) and parallaxes on scroll; the
 * copy lifts away as you leave. Photo-driven, immersive, editorial.
 */
export function Hero({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#050a2e]">
      {/* Photo layer */}
      <motion.div style={{ y: imgY }} className="absolute inset-0 -bottom-[22%]">
        <div
          className="relative h-full w-full"
          style={{ animation: reduce ? undefined : "vi-kenburns 22s ease-out both" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority
            quality={72}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </motion.div>

      {/* Scrims: bottom-heavy ink gradient + a soft brand tint + top fade for the header */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#050a2e]/65 via-[#050a2e]/45 to-[#050a2e]/96"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-tr from-[#071d99]/45 via-transparent to-transparent"
      />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-page absolute inset-x-0 bottom-0 pb-20 [text-shadow:0_2px_24px_rgba(5,10,46,0.45)] sm:pb-28"
      >
        <div className="max-w-4xl">
          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="accent-serif text-lg text-white/80 sm:text-xl"
          >
            Dal {SITE.foundedYear} · Università di Palermo
          </motion.p>

          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 max-w-3xl text-balance text-display-2xl text-white"
          >
            L&apos;associazione studentesca dei corsi di Ingegneria.
          </motion.h1>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Link
                href="/chi-siamo"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-[#050a2e] transition-transform hover:scale-[1.03]"
              >
                Scopri chi siamo
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10"
            >
              Leggi il blog
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute inset-x-0 bottom-6 flex justify-center">
        <span
          aria-hidden
          className="flex h-10 w-6 items-start justify-center rounded-full border border-white/40 p-1.5"
        >
          <span
            className="h-2 w-1 rounded-full bg-white"
            style={{ animation: reduce ? undefined : "vi-scroll-cue 1.8s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
