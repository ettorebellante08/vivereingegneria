"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/content/gallery";

const SPAN_CLASSES: Record<NonNullable<GalleryPhoto["span"]>, string> = {
  normal: "col-span-1 row-span-1",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
  big: "col-span-2 row-span-2",
};

/**
 * Full-bleed cover band: the photo sits behind an opaque ink→brand overlay,
 * with the section's kicker + title laid over it and a slow parallax on the
 * image. This is the "photo as background with an opaque filter" treatment.
 */
export function PhotoCover({
  photo,
  eyebrow,
  title,
  subtitle,
}: {
  photo: GalleryPhoto;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <div
      ref={ref}
      className="relative isolate overflow-hidden rounded-[1.75rem] px-6 py-24 sm:px-16 sm:py-32"
    >
      <motion.img
        src={photo.src}
        alt={photo.alt}
        style={{ y }}
        className="absolute inset-0 -z-20 h-[116%] w-full scale-105 object-cover"
      />
      {/* Opaque brand overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-[#050a2e]/90 via-[#071d99]/55 to-[#071d99]/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mix-blend-overlay opacity-40 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
      />

      <div className="relative mx-auto max-w-3xl text-center text-white">
        <p className="eyebrow text-white/70">{eyebrow}</p>
        <h2 className="mt-4 text-balance text-4xl leading-tight text-white sm:text-6xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Editorial mosaic. Dense auto-flow packs the varied tile spans tightly;
 * each tile has a gentle scroll parallax and a hover lift.
 */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      <div className="overflow-hidden rounded-2xl">
        <PhotoTile photo={photos[0]} aspect="aspect-[16/9]" />
      </div>
    );
  }

  return (
    <RevealGroup className="grid auto-rows-[130px] grid-flow-row-dense grid-cols-2 gap-3 sm:auto-rows-[170px] sm:gap-4 md:grid-cols-4 md:auto-rows-[190px]">
      {photos.map((photo) => (
        <RevealItem key={photo.src} className={SPAN_CLASSES[photo.span ?? "normal"]}>
          <PhotoTile photo={photo} className="h-full" />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function PhotoTile({
  photo,
  className,
  aspect,
}: {
  photo: GalleryPhoto;
  className?: string;
  aspect?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-14, 14]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5",
        aspect,
        className,
      )}
    >
      <motion.img
        src={photo.src}
        alt={photo.alt}
        style={{ y }}
        className="h-full w-full scale-110 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.18]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </div>
  );
}
