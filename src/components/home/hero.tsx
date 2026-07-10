"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { SITE } from "@/lib/site-config";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.15]);

  return (
    <section
      ref={ref}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-[#050a1f] text-white"
    >
      {/* Atmospheric background */}
      <motion.div aria-hidden style={{ scale: bgScale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_15%,rgba(68,83,245,0.45),transparent_60%),radial-gradient(80%_80%_at_10%_90%,rgba(7,29,153,0.6),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#050a1f)]" />
        <div
          className="absolute -right-24 top-1/2 hidden size-[38rem] -translate-y-1/2 opacity-[0.06] md:block"
          style={{
            background: "white",
            maskImage: "url(/brand/logo-mark.svg)",
            WebkitMaskImage: "url(/brand/logo-mark.svg)",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskSize: "contain",
            WebkitMaskSize: "contain",
            animation: reduce ? undefined : "vi-float 9s ease-in-out infinite",
          }}
        />
      </motion.div>

      {/* Vertical caption (reference-style side label) */}
      <div className="vertical-text eyebrow absolute left-6 top-1/2 hidden -translate-y-1/2 text-white/40 lg:block">
        Rappresentanza · Eventi · Comunità
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative mx-auto w-full max-w-6xl px-6 py-32"
      >
        <p className="vi-rise eyebrow text-white/60">
          Vivere Ingegneria — dal {SITE.foundedYear} · UniPa
        </p>

        <h1 className="mt-8 text-[clamp(3.5rem,12vw,11rem)] font-light leading-[0.92] tracking-tight">
          <span className="vi-rise block" style={{ animationDelay: "0.1s" }}>
            Vivere
          </span>
          <span
            className="vi-rise block italic text-brand-300"
            style={{ animationDelay: "0.22s" }}
          >
            l&apos;Ingegneria
          </span>
        </h1>

        <p
          className="vi-rise mt-10 max-w-xl text-lg leading-relaxed text-white/70"
          style={{ animationDelay: "0.4s" }}
        >
          {SITE.description}
        </p>

        <div
          className="vi-rise mt-12 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.55s" }}
        >
          <Link
            href="/chi-siamo"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-[#050a1f] transition-transform hover:scale-[1.03]"
          >
            Scopri chi siamo
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/corsi"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Trova il tuo corso
          </Link>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50">
        <ArrowDown
          className="size-5"
          style={{ animation: reduce ? undefined : "vi-scroll-cue 1.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}
