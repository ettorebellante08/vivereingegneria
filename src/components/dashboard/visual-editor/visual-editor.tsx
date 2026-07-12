"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  ExternalLink,
  MousePointerSquareDashed,
} from "lucide-react";
import type { CanvasHandlers } from "@/components/dashboard/visual-editor/editor-canvas";
import { SettingsPanel } from "@/components/dashboard/visual-editor/settings-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveStaticPageBlocks, type BlocksActionState } from "@/lib/actions/blocks";
import {
  createBlock,
  createSection,
  type Block,
  type LeafBlock,
} from "@/lib/blocks/schema";
import {
  findBlock,
  updateBlockById,
  removeBlockById,
  duplicateBlockById,
  moveBlockById,
  insertBlockAt,
  addToColumn,
  reorderTopLevel,
} from "@/lib/blocks/tree";
import { COURSES } from "@/lib/site-config";
import { GALLERY_PHOTOS } from "@/content/gallery";
import type { RenderData } from "@/components/blocks/block-renderer";

// Canvas is interactive-only (dnd-kit): render client-side to avoid SSR
// hydration mismatches on drag-handle ARIA ids.
const EditorCanvas = dynamic(
  () =>
    import("@/components/dashboard/visual-editor/editor-canvas").then(
      (m) => m.EditorCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">
        Caricamento editor…
      </div>
    ),
  },
);

function clientFormatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Elementor-style visual editor: a live canvas of the real page blocks with
 * hover toolbars and inline insertion, plus a settings panel for the selected
 * block. Saves via the block server action (web_admin+, re-checked by RLS).
 */
export function VisualEditor({
  slug,
  publicPath,
  initialTitle,
  initialBlocks,
  titleLabel = "Titolo della pagina",
}: {
  slug: string;
  publicPath: string;
  initialTitle: string;
  initialBlocks: Block[];
  titleLabel?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<BlocksActionState>(undefined);

  const data: RenderData = useMemo(
    () => ({
      courses: COURSES.map((c) => ({ slug: c.slug, name: c.name })),
      galleryPhotos: GALLERY_PHOTOS,
      formatDate: clientFormatDate,
      // posts left undefined → dynamic block shows a labelled placeholder
    }),
    [],
  );

  const selected = selectedId ? findBlock(blocks, selectedId) : null;

  const handlers: CanvasHandlers = {
    selectedId,
    data,
    onSelect: (id) => setSelectedId(id),
    onDuplicate: (id) => setBlocks((b) => duplicateBlockById(b, id)),
    onDelete: (id) =>
      setBlocks((b) => {
        setSelectedId((sel) => (sel === id ? null : sel));
        return removeBlockById(b, id);
      }),
    onMove: (id, dir) => setBlocks((b) => moveBlockById(b, id, dir)),
    onReorderTop: (a, o) => setBlocks((b) => reorderTopLevel(b, a, o)),
    onInsertTop: (index, type) => {
      const block = type === "section" ? createSection(2) : createBlock(type);
      setBlocks((b) => insertBlockAt(b, index, block));
      setSelectedId(block.id);
    },
    onAddToColumn: (sectionId, columnId, type) => {
      if (type === "section") return; // no nested sections
      const leaf = createBlock(type) as LeafBlock;
      setBlocks((b) => addToColumn(b, sectionId, columnId, leaf));
      setSelectedId(leaf.id);
    },
  };

  function updateSelected(next: Block) {
    if (!selectedId) return;
    setBlocks((b) => updateBlockById(b, selectedId, next));
  }

  function handleSave() {
    startTransition(async () => {
      setResult(undefined);
      const res = await saveStaticPageBlocks(slug, title, blocks);
      setResult(res);
    });
  }

  return (
    <div className="space-y-4">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Salva
          </Button>
          <Link
            href={publicPath}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ExternalLink className="size-4" /> Anteprima
          </Link>
        </div>
        {result?.error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" /> {result.error}
          </p>
        )}
        {result?.ok && (
          <p className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="size-4" /> {result.ok}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Settings panel */}
        <aside className="lg:order-1 lg:w-80 lg:shrink-0">
          <div className="lg:sticky lg:top-24 space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="space-y-1.5">
              <Label htmlFor="page-title">{titleLabel}</Label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="border-t border-border pt-4">
              {selected ? (
                <SettingsPanel block={selected} onChange={updateSelected} />
              ) : (
                <div className="flex flex-col items-center gap-2 py-6 text-center text-sm text-muted-foreground">
                  <MousePointerSquareDashed className="size-6 opacity-50" />
                  Seleziona un blocco sull&apos;anteprima per modificarlo.
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Live canvas */}
        <div className="min-w-0 flex-1 lg:order-2">
          <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
            <EditorCanvas blocks={blocks} handlers={handlers} />
          </div>
        </div>
      </div>
    </div>
  );
}
