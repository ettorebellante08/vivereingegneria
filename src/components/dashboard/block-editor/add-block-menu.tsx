"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heading,
  Pilcrow,
  ImageIcon,
  LayoutGrid,
  Quote,
  Minus,
  MousePointerClick,
  MoveVertical,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOCK_LABELS, type BlockType } from "@/lib/blocks/schema";

const PALETTE: { type: BlockType; icon: typeof Heading }[] = [
  { type: "heading", icon: Heading },
  { type: "paragraph", icon: Pilcrow },
  { type: "image", icon: ImageIcon },
  { type: "gallery", icon: LayoutGrid },
  { type: "quote", icon: Quote },
  { type: "button", icon: MousePointerClick },
  { type: "divider", icon: Minus },
  { type: "spacer", icon: MoveVertical },
];

export function AddBlockMenu({ onAdd }: { onAdd: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" />
        Aggiungi blocco
      </button>

      {open && (
        <div className="absolute inset-x-0 bottom-full z-20 mb-2 grid grid-cols-2 gap-1 rounded-xl border border-border bg-popover p-2 shadow-lg sm:grid-cols-4">
          {PALETTE.map(({ type, icon: Icon }) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-lg px-3 py-3 text-xs font-medium text-foreground transition-colors hover:bg-accent",
              )}
            >
              <Icon className="size-5 text-primary" />
              {BLOCK_LABELS[type]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
