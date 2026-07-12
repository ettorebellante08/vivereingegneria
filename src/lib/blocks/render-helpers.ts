import type { CSSProperties } from "react";
import type { BlockBackground } from "@/lib/blocks/schema";

const OVERLAY_RGB: Record<BlockBackground["overlayColor"], string> = {
  ink: "5, 10, 46",
  brand: "7, 29, 153",
  light: "250, 248, 243",
};

/**
 * Inline style + overlay props for an image/color background with an opaque
 * filter. Returns the container style plus the overlay layer's style.
 */
export function backgroundStyles(bg: BlockBackground): {
  hasMedia: boolean;
  containerStyle: CSSProperties;
  imageSrc: string | null;
  overlayStyle: CSSProperties;
} {
  if (bg.type === "color" && bg.color) {
    return {
      hasMedia: true,
      containerStyle: { backgroundColor: bg.color },
      imageSrc: null,
      overlayStyle: {},
    };
  }
  if (bg.type === "image" && bg.image) {
    const rgb = OVERLAY_RGB[bg.overlayColor] ?? OVERLAY_RGB.ink;
    return {
      hasMedia: true,
      containerStyle: {},
      imageSrc: bg.image,
      overlayStyle: {
        backgroundColor: `rgba(${rgb}, ${Math.max(0, Math.min(100, bg.overlay)) / 100})`,
      },
    };
  }
  return { hasMedia: false, containerStyle: {}, imageSrc: null, overlayStyle: {} };
}

/** Convert a YouTube/Vimeo URL into an embeddable src, or null if unknown. */
export function videoEmbedSrc(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  const yt =
    trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/) ??
    null;
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

export const PADDING_CLASSES: Record<string, string> = {
  none: "py-0",
  sm: "py-8",
  md: "py-14 sm:py-20",
  lg: "py-20 sm:py-32",
};

export const ALIGN_CLASSES: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const SPACER_HEIGHTS: Record<string, string> = {
  sm: "h-4",
  md: "h-10",
  lg: "h-20",
  xl: "h-32",
};

export const COVER_MIN_HEIGHT: Record<string, string> = {
  sm: "min-h-[18rem]",
  md: "min-h-[26rem]",
  lg: "min-h-[36rem]",
};
