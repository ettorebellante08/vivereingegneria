import { z } from "zod";

/**
 * Block-based page content — an Elementor-style system of composable
 * sections. Pages are stored as an ordered array of blocks (JSON) in
 * `static_pages.content_json`, rendered publicly by <BlockRenderer> and
 * edited in the dashboard by <BlockEditor>.
 */

const blockBase = { id: z.string() };

export const headingBlockSchema = z.object({
  ...blockBase,
  type: z.literal("heading"),
  text: z.string(),
  level: z.union([z.literal(2), z.literal(3)]).default(2),
  align: z.enum(["left", "center"]).default("left"),
});

export const paragraphBlockSchema = z.object({
  ...blockBase,
  type: z.literal("paragraph"),
  /** Sanitised rich-text HTML (bold/italic/links/lists). */
  html: z.string(),
});

export const imageBlockSchema = z.object({
  ...blockBase,
  type: z.literal("image"),
  src: z.string(),
  alt: z.string().default(""),
  caption: z.string().default(""),
  size: z.enum(["small", "medium", "full"]).default("full"),
});

export const galleryBlockSchema = z.object({
  ...blockBase,
  type: z.literal("gallery"),
  images: z
    .array(z.object({ src: z.string(), alt: z.string().default("") }))
    .default([]),
});

export const quoteBlockSchema = z.object({
  ...blockBase,
  type: z.literal("quote"),
  text: z.string(),
  attribution: z.string().default(""),
});

export const dividerBlockSchema = z.object({
  ...blockBase,
  type: z.literal("divider"),
  style: z.enum(["line", "space"]).default("line"),
});

export const buttonBlockSchema = z.object({
  ...blockBase,
  type: z.literal("button"),
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "outline"]).default("primary"),
  align: z.enum(["left", "center"]).default("left"),
});

export const spacerBlockSchema = z.object({
  ...blockBase,
  type: z.literal("spacer"),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

export const blockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  imageBlockSchema,
  galleryBlockSchema,
  quoteBlockSchema,
  dividerBlockSchema,
  buttonBlockSchema,
  spacerBlockSchema,
]);

export const pageBlocksSchema = z.object({
  blocks: z.array(blockSchema),
});

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;
export type QuoteBlock = z.infer<typeof quoteBlockSchema>;
export type DividerBlock = z.infer<typeof dividerBlockSchema>;
export type ButtonBlock = z.infer<typeof buttonBlockSchema>;
export type SpacerBlock = z.infer<typeof spacerBlockSchema>;

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Titolo",
  paragraph: "Testo",
  image: "Immagine",
  gallery: "Galleria immagini",
  quote: "Citazione",
  divider: "Divisore",
  button: "Pulsante",
  spacer: "Spaziatore",
};

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Factory: a fresh block of the given type with sensible defaults. */
export function createBlock(type: "heading"): HeadingBlock;
export function createBlock(type: "paragraph"): ParagraphBlock;
export function createBlock(type: "image"): ImageBlock;
export function createBlock(type: "gallery"): GalleryBlock;
export function createBlock(type: "quote"): QuoteBlock;
export function createBlock(type: "divider"): DividerBlock;
export function createBlock(type: "button"): ButtonBlock;
export function createBlock(type: "spacer"): SpacerBlock;
export function createBlock(type: BlockType): Block;
export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, text: "Nuovo titolo", level: 2, align: "left" };
    case "paragraph":
      return { id, type, html: "<p>Scrivi qui il testo…</p>" };
    case "image":
      return { id, type, src: "", alt: "", caption: "", size: "full" };
    case "gallery":
      return { id, type, images: [] };
    case "quote":
      return { id, type, text: "Una citazione d'impatto.", attribution: "" };
    case "divider":
      return { id, type, style: "line" };
    case "button":
      return { id, type, label: "Scopri di più", href: "/", variant: "primary", align: "left" };
    case "spacer":
      return { id, type, size: "md" };
  }
}

/** Parse arbitrary JSON into a validated block list; empty array on failure. */
export function parseBlocks(json: unknown): Block[] {
  const result = pageBlocksSchema.safeParse(json);
  return result.success ? result.data.blocks : [];
}
