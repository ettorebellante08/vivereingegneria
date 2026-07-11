"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BLOCK_LABELS, type Block } from "@/lib/blocks/schema";
import { BlockFields } from "@/components/dashboard/block-editor/block-fields";

export function SortableBlock({
  block,
  onChange,
  onDuplicate,
  onDelete,
}: {
  block: Block;
  onChange: (next: Block) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/block rounded-xl border border-border bg-card transition-shadow",
        isDragging && "z-10 shadow-lg",
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <button
          type="button"
          className="flex size-7 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent active:cursor-grabbing"
          aria-label="Trascina per riordinare"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <span className="text-xs font-medium text-muted-foreground">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={onDuplicate}
            title="Duplica"
            aria-label="Duplica blocco"
            className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Copy className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Elimina"
            aria-label="Elimina blocco"
            className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <BlockFields block={block} onChange={onChange} />
      </div>
    </div>
  );
}
