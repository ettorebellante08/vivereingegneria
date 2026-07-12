"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heading,
  Type,
  Image as ImageIcon,
  Images,
  Quote,
  Minus,
  MousePointerClick,
  StretchVertical,
  LayoutPanelTop,
  LayoutGrid,
  Columns3,
  ListCollapse,
  Hash,
  Video,
  Info,
  Newspaper,
  GraduationCap,
  Camera,
  Megaphone,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { BLOCK_GROUPS, BLOCK_LABELS, type BlockType } from "@/lib/blocks/schema";
import { cn } from "@/lib/utils";

const ICONS: Record<BlockType, LucideIcon> = {
  section: Columns3,
  heading: Heading,
  paragraph: Type,
  image: ImageIcon,
  gallery: Images,
  quote: Quote,
  divider: Minus,
  button: MousePointerClick,
  spacer: StretchVertical,
  cover: LayoutPanelTop,
  cards: LayoutGrid,
  accordion: ListCollapse,
  stats: Hash,
  video: Video,
  callout: Info,
  latestPosts: Newspaper,
  coursesList: GraduationCap,
  photoGallery: Camera,
  ctaBanner: Megaphone,
};

/**
 * Block palette. Renders a trigger; when open, a grouped grid of block types.
 * `variant="inline"` is the thin "+" used between blocks / inside columns.
 */
export function AddBlockMenu({
  onAdd,
  variant = "button",
  label = "Aggiungi blocco",
  exclude,
}: {
  onAdd: (type: BlockType) => void;
  variant?: "button" | "inline";
  label?: string;
  exclude?: BlockType[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {variant === "inline" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group flex w-full items-center justify-center py-1.5"
          aria-label={label}
        >
          <span className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/40" />
          <span className="mx-2 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
            <Plus className="size-3.5" />
          </span>
          <span className="h-px flex-1 bg-border transition-colors group-hover:bg-primary/40" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <Plus className="size-4" /> {label}
        </button>
      )}

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[22rem] max-w-[85vw] rounded-xl border border-border bg-popover p-3 shadow-xl",
            variant === "inline" ? "left-1/2 -translate-x-1/2" : "left-0",
          )}
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Blocchi
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Chiudi"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-[60vh] space-y-3 overflow-y-auto">
            {BLOCK_GROUPS.map((group) => {
              const types = group.types.filter((t) => !exclude?.includes(t));
              if (types.length === 0) return null;
              return (
              <div key={group.label}>
                <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
                  {group.label}
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {types.map((type) => {
                    const Icon = ICONS[type];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          onAdd(type);
                          setOpen(false);
                        }}
                        className="flex flex-col items-center gap-1 rounded-lg border border-border p-2.5 text-center transition-colors hover:border-primary hover:bg-accent"
                      >
                        <Icon className="size-4 text-primary" />
                        <span className="text-[11px] leading-tight">{BLOCK_LABELS[type]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
