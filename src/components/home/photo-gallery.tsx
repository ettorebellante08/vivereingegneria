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
 * Mosaic photo grid with a gentle scroll parallax + hover lift on each tile.
 * Falls back to a single full-width feature image when only one photo is
 * available, so the section still looks intentional before more are added.
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
    <RevealGroup className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:gap-4 md:grid-cols-4 md:auto-rows-[200px]">
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
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-16, 16]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-muted",
        aspect,
        className,
      )}
    >
      <motion.img
        src={photo.src}
        alt={photo.alt}
        style={{ y }}
        className="h-full w-full scale-110 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.18]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
