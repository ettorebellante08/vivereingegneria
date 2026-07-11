import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prose } from "@/components/prose";
import type { Block } from "@/lib/blocks/schema";

const IMAGE_SIZE_CLASSES: Record<string, string> = {
  small: "max-w-md",
  medium: "max-w-2xl",
  full: "max-w-none",
};

/** Renders a validated block array as the editorial-styled public page body. */
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}
    </div>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          className={cn(
            block.level === 2 ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            block.align === "center" && "text-center",
          )}
        >
          {block.text}
        </Tag>
      );
    }

    case "paragraph":
      return <Prose html={block.html} />;

    case "image":
      if (!block.src) return null;
      return (
        <figure className={cn("mx-auto", IMAGE_SIZE_CLASSES[block.size])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className="w-full rounded-2xl object-cover"
          />
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "gallery": {
      const images = block.images.filter((img) => img.src);
      if (images.length === 0) return null;
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      );
    }

    case "quote":
      return (
        <figure className="relative rounded-2xl border border-border bg-card p-8">
          <span className="font-display text-6xl leading-none text-primary/25">
            &ldquo;
          </span>
          <blockquote className="-mt-6 font-display text-2xl leading-snug">
            {block.text}
          </blockquote>
          {block.attribution && (
            <figcaption className="eyebrow mt-6 text-muted-foreground">
              {block.attribution}
            </figcaption>
          )}
        </figure>
      );

    case "divider":
      return block.style === "line" ? (
        <hr className="border-border" />
      ) : (
        <div aria-hidden className="h-8" />
      );

    case "button":
      return (
        <div className={cn(block.align === "center" && "text-center")}>
          <Link
            href={block.href}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
              block.variant === "primary"
                ? "bg-primary text-primary-foreground hover:bg-brand-700"
                : "border border-foreground/15 hover:border-primary hover:text-primary",
            )}
          >
            {block.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      );

    case "spacer": {
      const heights: Record<string, string> = {
        sm: "h-4",
        md: "h-10",
        lg: "h-20",
      };
      return <div aria-hidden className={heights[block.size]} />;
    }
  }
}
