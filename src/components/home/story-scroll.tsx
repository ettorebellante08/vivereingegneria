"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StoryChapter = {
  n: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  photo: string;
  alt: string;
};

/**
 * Pinned scroll-storytelling. The photograph stays fixed and crossfades from
 * chapter to chapter while the text scrolls over it — the immersive
 * "the photo changes, the text moves" effect. Falls back to simple stacked
 * full-bleed panels when the visitor prefers reduced motion.
 */
export function StoryScroll({ chapters }: { chapters: StoryChapter[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (reduce) {
    return (
      <div>
        {chapters.map((c) => (
          <StackedPanel key={c.href} chapter={c} />
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: `${chapters.length * 100}svh` }}>
      {/* Pinned photo stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#050a2e]">
        {chapters.map((c, i) => (
          <CrossfadeImage
            key={c.photo}
            src={c.photo}
            alt={c.alt}
            index={i}
            total={chapters.length}
            progress={scrollYProgress}
          />
        ))}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#050a2e]/92 via-[#050a2e]/45 to-[#050a2e]/70"
        />
      </div>

      {/* Text panels scrolling over the pinned stage */}
      <div className="relative -mt-[100svh]">
        {chapters.map((c, i) => (
          <div
            key={c.href}
            className="flex h-[100svh] items-center"
          >
            <div className="container-page w-full">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-35% 0px -35% 0px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "max-w-xl text-white",
                  i % 2 === 1 && "ml-auto text-right",
                )}
              >
                <span className="accent-serif block text-5xl text-white/40 sm:text-6xl">
                  {c.n}
                </span>
                <p className="eyebrow mt-3 text-white/70">{c.eyebrow}</p>
                <h2 className="mt-3 text-balance text-display-xl text-white">{c.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-white/80">{c.text}</p>
                <Link
                  href={c.href}
                  className={cn(
                    "group mt-7 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/10",
                    i % 2 === 1 && "flex-row-reverse",
                  )}
                >
                  {c.cta}
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** One crossfading background image, opacity peaking during its scroll band.
 *  Offsets are clamped to [0,1] and strictly increasing (motion rejects
 *  negative / non-monotonic input ranges). */
function CrossfadeImage({
  src,
  alt,
  index,
  total,
  progress,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const band = 1 / total;
  const s = index * band; // band start
  const e = (index + 1) * band; // band end
  const f = band * 0.3; // crossfade width
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const times = isFirst
    ? [0, e - f, e, Math.min(1, e + f)]
    : isLast
      ? [Math.max(0, s - f), s, s + f, 1]
      : [s - f, s + f, e - f, e + f];
  const opacityOut = isFirst ? [1, 1, 1, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0];

  // Opacity-only crossfade — compositor-friendly, no per-frame repaint of the
  // full-bleed image (animating scale here was the main source of jank).
  const opacity = useTransform(progress, times, opacityOut, { clamp: true });

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 will-change-[opacity]">
      <Image
        src={src}
        alt={alt}
        fill
        quality={70}
        loading="eager"
        sizes="100vw"
        className="scale-105 object-cover object-center"
      />
    </motion.div>
  );
}

/** Reduced-motion fallback: a plain stacked full-bleed panel. */
function StackedPanel({ chapter: c }: { chapter: StoryChapter }) {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-[#050a2e]">
      <Image src={c.photo} alt={c.alt} fill sizes="100vw" className="object-cover object-center" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#050a2e]/92 via-[#050a2e]/50 to-[#050a2e]/70"
      />
      <div className="container-page relative w-full">
        <div className="max-w-xl text-white">
          <span className="accent-serif block text-5xl text-white/40">{c.n}</span>
          <p className="eyebrow mt-3 text-white/70">{c.eyebrow}</p>
          <h2 className="mt-3 text-balance text-display-xl text-white">{c.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-white/80">{c.text}</p>
          <Link
            href={c.href}
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            {c.cta}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
