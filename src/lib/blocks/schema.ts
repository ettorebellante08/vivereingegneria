import { z } from "zod";

/**
 * Block-based page content — an Elementor-style system of composable
 * sections. Pages are stored as an ordered array of blocks (JSON) in
 * `static_pages.content_json` (also for reserved slugs `home` and
 * `corso:<slug>`), rendered publicly by <BlockRenderer> and edited in the
 * dashboard by the visual editor.
 *
 * Structure: a page is an array of blocks. Most blocks are "leaf" content
 * widgets; the `section` block is a layout container holding 1–3 columns,
 * each with its own array of leaf blocks (one level of nesting, like Elementor
 * Section → Column → Widget).
 */

const blockBase = { id: z.string() };

/* ---- shared sub-shapes ----------------------------------------------- */

const alignEnum = z.enum(["left", "center", "right"]).default("left");

/** Background for section/cover: solid colour or image + opaque overlay. */
export const backgroundSchema = z.object({
  type: z.enum(["none", "color", "image"]).default("none"),
  color: z.string().default(""),
  image: z.string().default(""),
  /** Overlay opacity 0–100 applied over the image. */
  overlay: z.number().min(0).max(100).default(55),
  overlayColor: z.enum(["ink", "brand", "light"]).default("ink"),
});
export type BlockBackground = z.infer<typeof backgroundSchema>;

/* ---- leaf blocks ------------------------------------------------------ */

export const headingBlockSchema = z.object({
  ...blockBase,
  type: z.literal("heading"),
  text: z.string(),
  level: z.union([z.literal(2), z.literal(3)]).default(2),
  align: alignEnum,
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
  rounded: z.boolean().default(true),
});

export const galleryBlockSchema = z.object({
  ...blockBase,
  type: z.literal("gallery"),
  images: z
    .array(z.object({ src: z.string(), alt: z.string().default("") }))
    .default([]),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
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
  style: z.enum(["line", "space", "dots"]).default("line"),
});

export const buttonBlockSchema = z.object({
  ...blockBase,
  type: z.literal("button"),
  label: z.string(),
  href: z.string(),
  variant: z.enum(["primary", "outline", "ghost"]).default("primary"),
  align: alignEnum,
});

export const spacerBlockSchema = z.object({
  ...blockBase,
  type: z.literal("spacer"),
  size: z.enum(["sm", "md", "lg", "xl"]).default("md"),
});

/** Full-bleed hero band: background image + overlay + heading/text/button. */
export const coverBlockSchema = z.object({
  ...blockBase,
  type: z.literal("cover"),
  eyebrow: z.string().default(""),
  title: z.string(),
  subtitle: z.string().default(""),
  background: backgroundSchema,
  buttonLabel: z.string().default(""),
  buttonHref: z.string().default(""),
  align: alignEnum,
  minHeight: z.enum(["sm", "md", "lg"]).default("md"),
});

/** Grid of link cards (icon/image + title + text + internal link). */
export const cardsBlockSchema = z.object({
  ...blockBase,
  type: z.literal("cards"),
  columns: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  items: z
    .array(
      z.object({
        icon: z.string().default(""),
        image: z.string().default(""),
        title: z.string().default(""),
        text: z.string().default(""),
        href: z.string().default(""),
      }),
    )
    .default([]),
});

/** FAQ-style accordion. */
export const accordionBlockSchema = z.object({
  ...blockBase,
  type: z.literal("accordion"),
  items: z
    .array(z.object({ title: z.string().default(""), body: z.string().default("") }))
    .default([]),
});

/** Row of animated stat counters. */
export const statsBlockSchema = z.object({
  ...blockBase,
  type: z.literal("stats"),
  items: z
    .array(
      z.object({
        value: z.number().default(0),
        suffix: z.string().default(""),
        label: z.string().default(""),
      }),
    )
    .default([]),
});

/** Responsive embedded video (YouTube/Vimeo URL). */
export const videoBlockSchema = z.object({
  ...blockBase,
  type: z.literal("video"),
  url: z.string().default(""),
  caption: z.string().default(""),
});

/** Coloured notice/info box. */
export const calloutBlockSchema = z.object({
  ...blockBase,
  type: z.literal("callout"),
  variant: z.enum(["info", "success", "warning", "brand"]).default("brand"),
  title: z.string().default(""),
  body: z.string().default(""),
});

/* ---- dynamic blocks (auto data, server-rendered) --------------------- */

export const latestPostsBlockSchema = z.object({
  ...blockBase,
  type: z.literal("latestPosts"),
  heading: z.string().default("Ultimi articoli"),
  count: z.number().min(1).max(9).default(3),
});

export const coursesListBlockSchema = z.object({
  ...blockBase,
  type: z.literal("coursesList"),
  heading: z.string().default("I corsi di laurea"),
});

export const photoGalleryBlockSchema = z.object({
  ...blockBase,
  type: z.literal("photoGallery"),
  heading: z.string().default(""),
});

export const ctaBannerBlockSchema = z.object({
  ...blockBase,
  type: z.literal("ctaBanner"),
  title: z.string().default("Vuoi far parte di Vivere Ingegneria?"),
  text: z.string().default(""),
  buttonLabel: z.string().default("Contattaci"),
  buttonHref: z.string().default("/contatti"),
});

/* ---- unions ----------------------------------------------------------- */

/** Every non-layout block. These are what can live inside a section column. */
export const leafBlockSchema = z.discriminatedUnion("type", [
  headingBlockSchema,
  paragraphBlockSchema,
  imageBlockSchema,
  galleryBlockSchema,
  quoteBlockSchema,
  dividerBlockSchema,
  buttonBlockSchema,
  spacerBlockSchema,
  coverBlockSchema,
  cardsBlockSchema,
  accordionBlockSchema,
  statsBlockSchema,
  videoBlockSchema,
  calloutBlockSchema,
  latestPostsBlockSchema,
  coursesListBlockSchema,
  photoGalleryBlockSchema,
  ctaBannerBlockSchema,
]);
export type LeafBlock = z.infer<typeof leafBlockSchema>;

export const columnSchema = z.object({
  id: z.string(),
  blocks: z.array(leafBlockSchema).default([]),
});
export type Column = z.infer<typeof columnSchema>;

/** Layout container: background + 1–3 columns of leaf blocks. */
export const sectionBlockSchema = z.object({
  ...blockBase,
  type: z.literal("section"),
  background: backgroundSchema,
  padding: z.enum(["none", "sm", "md", "lg"]).default("md"),
  width: z.enum(["contained", "full"]).default("contained"),
  textColor: z.enum(["default", "light"]).default("default"),
  columns: z.array(columnSchema).default([]),
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
  coverBlockSchema,
  cardsBlockSchema,
  accordionBlockSchema,
  statsBlockSchema,
  videoBlockSchema,
  calloutBlockSchema,
  latestPostsBlockSchema,
  coursesListBlockSchema,
  photoGalleryBlockSchema,
  ctaBannerBlockSchema,
  sectionBlockSchema,
]);

export const pageBlocksSchema = z.object({
  blocks: z.array(blockSchema),
});

export type Block = z.infer<typeof blockSchema>;
export type BlockType = Block["type"];
export type SectionBlock = z.infer<typeof sectionBlockSchema>;
export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type GalleryBlock = z.infer<typeof galleryBlockSchema>;
export type QuoteBlock = z.infer<typeof quoteBlockSchema>;
export type ButtonBlock = z.infer<typeof buttonBlockSchema>;
export type CoverBlock = z.infer<typeof coverBlockSchema>;
export type CardsBlock = z.infer<typeof cardsBlockSchema>;

/* ---- labels & palette metadata --------------------------------------- */

export const BLOCK_LABELS: Record<BlockType, string> = {
  section: "Sezione",
  heading: "Titolo",
  paragraph: "Testo",
  image: "Immagine",
  gallery: "Galleria",
  quote: "Citazione",
  divider: "Divisore",
  button: "Pulsante",
  spacer: "Spaziatore",
  cover: "Copertina",
  cards: "Card",
  accordion: "Accordion",
  stats: "Numeri",
  video: "Video",
  callout: "Box informativo",
  latestPosts: "Ultimi articoli",
  coursesList: "Elenco corsi",
  photoGallery: "Galleria foto",
  ctaBanner: "Banner CTA",
};

/** Group blocks in the "add" palette, in insertion-friendly order. */
export const BLOCK_GROUPS: { label: string; types: BlockType[] }[] = [
  { label: "Base", types: ["heading", "paragraph", "image", "button", "divider", "spacer"] },
  { label: "Media & layout", types: ["cover", "gallery", "cards", "section", "video"] },
  { label: "Contenuti ricchi", types: ["quote", "accordion", "stats", "callout"] },
  { label: "Dinamici", types: ["latestPosts", "coursesList", "photoGallery", "ctaBanner"] },
];

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const defaultBackground = (): BlockBackground => ({
  type: "none",
  color: "",
  image: "",
  overlay: 55,
  overlayColor: "ink",
});

/** Per-type default field values (everything except `id`). */
type BlockDefaults = { [K in BlockType]: Omit<Extract<Block, { type: K }>, "id"> };

const DEFAULTS: BlockDefaults = {
  heading: { type: "heading", text: "Nuovo titolo", level: 2, align: "left" },
  paragraph: { type: "paragraph", html: "<p>Scrivi qui il testo…</p>" },
  image: { type: "image", src: "", alt: "", caption: "", size: "full", rounded: true },
  gallery: { type: "gallery", images: [], columns: 3 },
  quote: { type: "quote", text: "Una citazione d'impatto.", attribution: "" },
  divider: { type: "divider", style: "line" },
  button: { type: "button", label: "Scopri di più", href: "/", variant: "primary", align: "left" },
  spacer: { type: "spacer", size: "md" },
  cover: {
    type: "cover",
    eyebrow: "",
    title: "Titolo della copertina",
    subtitle: "",
    background: { ...defaultBackground(), type: "image", overlay: 55, overlayColor: "ink" },
    buttonLabel: "",
    buttonHref: "",
    align: "center",
    minHeight: "md",
  },
  cards: {
    type: "cards",
    columns: 3,
    items: [
      { icon: "", image: "", title: "Card 1", text: "Descrizione della card.", href: "" },
      { icon: "", image: "", title: "Card 2", text: "Descrizione della card.", href: "" },
      { icon: "", image: "", title: "Card 3", text: "Descrizione della card.", href: "" },
    ],
  },
  accordion: {
    type: "accordion",
    items: [
      { title: "Prima domanda", body: "Risposta alla prima domanda." },
      { title: "Seconda domanda", body: "Risposta alla seconda domanda." },
    ],
  },
  stats: {
    type: "stats",
    items: [
      { value: 2008, suffix: "", label: "dal" },
      { value: 14, suffix: "", label: "corsi di laurea" },
      { value: 100, suffix: "+", label: "studenti coinvolti" },
    ],
  },
  video: { type: "video", url: "", caption: "" },
  callout: { type: "callout", variant: "brand", title: "Nota", body: "Testo informativo." },
  latestPosts: { type: "latestPosts", heading: "Ultimi articoli", count: 3 },
  coursesList: { type: "coursesList", heading: "I corsi di laurea" },
  photoGallery: { type: "photoGallery", heading: "" },
  ctaBanner: {
    type: "ctaBanner",
    title: "Vuoi far parte di Vivere Ingegneria?",
    text: "Scrivici o passa a trovarci: c'è sempre qualcosa da costruire insieme.",
    buttonLabel: "Contattaci",
    buttonHref: "/contatti",
  },
  section: {
    type: "section",
    background: defaultBackground(),
    padding: "md",
    width: "contained",
    textColor: "default",
    columns: [],
  },
};

/** Factory: a fresh block of the given type with sensible defaults. The
 * generic return keeps the precise per-type shape (e.g. createBlock("cover")
 * is a CoverBlock), so callers can spread and override typed fields. */
export function createBlock<T extends BlockType>(type: T): Extract<Block, { type: T }> {
  const base = structuredCloneSafe(DEFAULTS[type]);
  return { id: newId(), ...base } as unknown as Extract<Block, { type: T }>;
}

/** Create a section pre-filled with `n` empty columns. */
export function createSection(columns = 1): SectionBlock {
  const section = createBlock("section");
  section.columns = Array.from({ length: columns }, () => ({
    id: newId(),
    blocks: [],
  }));
  return section;
}

/** A fresh empty column (for the editor when adding columns). */
export function createColumn(): Column {
  return { id: newId(), blocks: [] };
}

function structuredCloneSafe<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}

/** Parse arbitrary JSON into a validated block list; empty array on failure. */
export function parseBlocks(json: unknown): Block[] {
  const result = pageBlocksSchema.safeParse(json);
  return result.success ? result.data.blocks : [];
}
