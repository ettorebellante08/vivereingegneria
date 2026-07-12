import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarDays, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prose } from "@/components/prose";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { AccordionBlock } from "@/components/blocks/accordion-block";
import { StatsBlock } from "@/components/blocks/stats-block";
import { PhotoGallery } from "@/components/home/photo-gallery";
import {
  backgroundStyles,
  videoEmbedSrc,
  PADDING_CLASSES,
  ALIGN_CLASSES,
  SPACER_HEIGHTS,
  COVER_MIN_HEIGHT,
} from "@/lib/blocks/render-helpers";
import type { Block, LeafBlock, SectionBlock } from "@/lib/blocks/schema";
import type { GalleryPhoto } from "@/content/gallery";

/** Pre-fetched data the dynamic blocks render from (passed by the page). When
 * a field is `undefined` (e.g. inside the editor) the block shows a labelled
 * placeholder instead of live data. */
export type RenderData = {
  posts?: {
    id: string;
    title: string;
    slug: string;
    published_at: string | null;
    cover_url?: string | null;
  }[];
  courses?: { slug: string; name: string }[];
  galleryPhotos?: GalleryPhoto[];
  formatDate?: (iso: string | null) => string;
};

const IMAGE_SIZE_CLASSES: Record<string, string> = {
  small: "max-w-md",
  medium: "max-w-2xl",
  full: "max-w-none",
};

const GALLERY_COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const CARD_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-brand-700",
  outline: "border border-foreground/15 hover:border-primary hover:text-primary",
  ghost: "text-primary hover:underline",
};

/** Blocks that read best in a wide (max-w-6xl) column at the top level; the
 * rest use a narrow readable column. Sections manage their own width. */
const WIDE_TOP_LEVEL = new Set<Block["type"]>([
  "cover",
  "cards",
  "gallery",
  "stats",
  "video",
  "latestPosts",
  "coursesList",
  "photoGallery",
  "ctaBanner",
]);

/** Renders a validated block array as the editorial-styled public page body.
 * Top-level blocks get a sensible content width; sections span full-bleed and
 * control their own width. Used for both public pages and the editor canvas. */
export function BlockRenderer({
  blocks,
  data,
}: {
  blocks: Block[];
  data?: RenderData;
}) {
  return (
    <div className="space-y-10">
      {blocks.map((block) => {
        if (block.type === "section") {
          return <BlockView key={block.id} block={block} data={data} />;
        }
        const wide = WIDE_TOP_LEVEL.has(block.type);
        return (
          <div
            key={block.id}
            className={cn("mx-auto px-6", wide ? "max-w-6xl" : "max-w-3xl")}
          >
            <BlockView block={block} data={data} />
          </div>
        );
      })}
    </div>
  );
}

export function BlockView({
  block,
  data,
}: {
  block: Block;
  data?: RenderData;
}) {
  switch (block.type) {
    case "section":
      return <SectionView block={block} data={data} />;
    default:
      return <LeafView block={block} data={data} />;
  }
}

function SectionView({
  block,
  data,
}: {
  block: SectionBlock;
  data?: RenderData;
}) {
  const bg = backgroundStyles(block.background);
  const light = block.textColor === "light";
  const cols = block.columns.length || 1;

  return (
    <section
      className={cn("relative isolate overflow-hidden", PADDING_CLASSES[block.padding])}
      style={bg.containerStyle}
    >
      {bg.imageSrc && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bg.imageSrc}
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 -z-10" style={bg.overlayStyle} />
        </>
      )}
      <div
        className={cn(
          "px-6",
          block.width === "contained" ? "mx-auto max-w-6xl" : "mx-auto max-w-none",
          light && "text-white [&_h2]:text-white [&_h3]:text-white",
        )}
      >
        <div
          className="grid gap-8 sm:gap-10"
          style={{ gridTemplateColumns: `repeat(${Math.min(cols, 3)}, minmax(0, 1fr))` }}
        >
          {block.columns.map((column) => (
            <div key={column.id} className="space-y-6">
              {column.blocks.map((leaf) => (
                <LeafView key={leaf.id} block={leaf} data={data} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeafView({ block, data }: { block: LeafBlock; data?: RenderData }) {
  switch (block.type) {
    case "heading": {
      const Tag = block.level === 2 ? "h2" : "h3";
      return (
        <Tag
          className={cn(
            block.level === 2 ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            ALIGN_CLASSES[block.align],
          )}
        >
          {block.text}
        </Tag>
      );
    }

    case "paragraph":
      return <Prose html={block.html} />;

    case "image":
      if (!block.src) return <EmptyHint label="Immagine" />;
      return (
        <figure className={cn("mx-auto", IMAGE_SIZE_CLASSES[block.size])}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className={cn("w-full object-cover", block.rounded && "rounded-2xl")}
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
      if (images.length === 0) return <EmptyHint label="Galleria" />;
      return (
        <div className={cn("grid gap-3 sm:gap-4", GALLERY_COLS[block.columns] ?? GALLERY_COLS[3])}>
          {images.map((img, i) => (
            <div
              key={`${img.src}-${i}`}
              className="aspect-square overflow-hidden rounded-xl bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      );
    }

    case "quote":
      return (
        <figure className="relative rounded-2xl border border-border bg-card p-8">
          <span className="font-display text-6xl leading-none text-primary/25">&ldquo;</span>
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
      if (block.style === "space") return <div aria-hidden className="h-8" />;
      if (block.style === "dots")
        return (
          <div aria-hidden className="flex justify-center gap-2 py-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="size-1.5 rounded-full bg-primary/40" />
            ))}
          </div>
        );
      return <hr className="border-border" />;

    case "button":
      return (
        <div className={ALIGN_CLASSES[block.align]}>
          <Link
            href={block.href || "#"}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors",
              BUTTON_VARIANTS[block.variant] ?? BUTTON_VARIANTS.primary,
            )}
          >
            {block.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      );

    case "spacer":
      return <div aria-hidden className={SPACER_HEIGHTS[block.size]} />;

    case "cover": {
      const bg = backgroundStyles(block.background);
      return (
        <div
          className={cn(
            "relative isolate flex flex-col justify-center overflow-hidden rounded-[1.75rem] px-6 py-16 sm:px-16",
            COVER_MIN_HEIGHT[block.minHeight],
            ALIGN_CLASSES[block.align],
          )}
          style={bg.containerStyle}
        >
          {bg.imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bg.imageSrc}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover"
              />
              <div aria-hidden className="absolute inset-0 -z-10" style={bg.overlayStyle} />
            </>
          ) : (
            <div aria-hidden className="absolute inset-0 -z-10 bg-secondary" />
          )}
          <div
            className={cn(
              "relative mx-auto max-w-3xl text-white",
              block.align === "center" && "mx-auto",
              block.align === "left" && "mr-auto ml-0",
            )}
          >
            {block.eyebrow && <p className="eyebrow text-white/70">{block.eyebrow}</p>}
            <h2 className="mt-3 text-balance text-4xl leading-tight text-white sm:text-5xl">
              {block.title}
            </h2>
            {block.subtitle && (
              <p className="mt-4 max-w-xl text-balance leading-relaxed text-white/80">
                {block.subtitle}
              </p>
            )}
            {block.buttonLabel && (
              <Link
                href={block.buttonHref || "#"}
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary transition-transform hover:scale-[1.03]"
              >
                {block.buttonLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </div>
      );
    }

    case "cards": {
      const items = block.items.filter((it) => it.title.trim() || it.image || it.text.trim());
      if (items.length === 0) return <EmptyHint label="Card" />;
      return (
        <RevealGroup className={cn("grid gap-6", CARD_COLS[block.columns] ?? CARD_COLS[3])}>
          {items.map((item, i) => {
            const inner = (
              <>
                {item.image ? (
                  <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : item.icon ? (
                  <div className="text-3xl">{item.icon}</div>
                ) : null}
                <h3 className="mt-4 flex items-center gap-1.5 text-xl">
                  {item.title}
                  {item.href && (
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  )}
                </h3>
                {item.text && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                )}
              </>
            );
            return (
              <RevealItem key={i}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="group block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="group rounded-2xl border border-border bg-card p-5">{inner}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      );
    }

    case "accordion":
      return <AccordionBlock items={block.items} />;

    case "stats":
      return <StatsBlock items={block.items} />;

    case "video": {
      const src = videoEmbedSrc(block.url);
      if (!src) return <EmptyHint label="Video (incolla un link YouTube o Vimeo)" />;
      return (
        <figure>
          <div className="aspect-video overflow-hidden rounded-2xl bg-black">
            <iframe
              src={src}
              title={block.caption || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-3 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "callout": {
      const styles: Record<string, string> = {
        info: "border-sky-200 bg-sky-50 text-sky-900",
        success: "border-emerald-200 bg-emerald-50 text-emerald-900",
        warning: "border-amber-200 bg-amber-50 text-amber-900",
        brand: "border-brand-200 bg-secondary text-secondary-foreground",
      };
      return (
        <div
          className={cn(
            "flex gap-3 rounded-2xl border p-5",
            styles[block.variant] ?? styles.brand,
          )}
        >
          <Info className="mt-0.5 size-5 shrink-0" />
          <div>
            {block.title && <p className="font-display text-lg">{block.title}</p>}
            {block.body && <p className="mt-1 text-sm leading-relaxed">{block.body}</p>}
          </div>
        </div>
      );
    }

    /* ---- dynamic ---- */

    case "latestPosts": {
      if (!data?.posts) return <DynamicHint label={block.heading} note="Ultimi articoli dal blog" />;
      const posts = data.posts.slice(0, block.count);
      if (posts.length === 0)
        return <DynamicHint label={block.heading} note="Nessun articolo pubblicato" />;
      return (
        <div>
          <h2 className="mb-6 text-3xl sm:text-4xl">{block.heading}</h2>
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <RevealItem key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden rounded-2xl border border-border">
                    {post.cover_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_url}
                        alt=""
                        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="aspect-[16/10] w-full bg-gradient-to-br from-brand-800 to-brand-500" />
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {data.formatDate?.(post.published_at) ?? ""}
                  </div>
                  <h3 className="mt-2 text-xl leading-snug transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      );
    }

    case "coursesList": {
      if (!data?.courses) return <DynamicHint label={block.heading} note="Elenco dei corsi di laurea" />;
      return (
        <div>
          <h2 className="mb-6 text-3xl sm:text-4xl">{block.heading}</h2>
          <RevealGroup className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.courses.map((c) => (
              <RevealItem key={c.slug}>
                <Link
                  href={`/corsi/${c.slug}`}
                  className="group -mx-3 flex items-center justify-between gap-3 rounded-lg border-b border-border px-3 py-4 transition-all hover:border-transparent hover:bg-secondary/70 hover:text-primary"
                >
                  <span className="text-lg">{c.name}</span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      );
    }

    case "photoGallery": {
      const photos = data?.galleryPhotos;
      if (!photos) return <DynamicHint label={block.heading || "Galleria foto"} note="Le foto dell'associazione" />;
      return (
        <div>
          {block.heading && <h2 className="mb-6 text-3xl sm:text-4xl">{block.heading}</h2>}
          <PhotoGallery photos={photos} />
        </div>
      );
    }

    case "ctaBanner":
      return (
        <Reveal>
          <div className="rounded-[1.75rem] border border-border bg-secondary px-8 py-16 text-center sm:px-16">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl leading-tight sm:text-5xl">
              {block.title}
            </h2>
            {block.text && (
              <p className="mx-auto mt-5 max-w-xl text-balance text-muted-foreground">
                {block.text}
              </p>
            )}
            {block.buttonLabel && (
              <Link
                href={block.buttonHref || "#"}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-700"
              >
                {block.buttonLabel}
                <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </Reveal>
      );
  }
}

/** Small dashed placeholder shown when a content block has no media yet. */
function EmptyHint({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {label}: nessun contenuto ancora.
    </div>
  );
}

/** Placeholder shown for dynamic blocks inside the editor (no live data). */
function DynamicHint({ label, note }: { label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/30 bg-secondary/40 p-8 text-center">
      <p className="font-display text-xl">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note} — generati automaticamente.</p>
    </div>
  );
}
