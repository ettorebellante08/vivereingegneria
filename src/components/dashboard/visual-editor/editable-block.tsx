"use client";

import type { ReactNode, CSSProperties } from "react";
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BlockActions = {
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

/**
 * Chrome around a block on the editor canvas: a click overlay to select it
 * (which also makes the inner preview inert so its links/inputs don't fire),
 * plus a floating toolbar. Optionally exposes a drag handle for top-level
 * sortable reordering.
 */
export function EditableBlock({
  label,
  actions,
  dragHandle,
  style,
  children,
}: {
  label: string;
  actions: BlockActions;
  dragHandle?: { attributes: Record<string, unknown>; listeners?: Record<string, unknown> };
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={style}
      className={cn(
        "group/eb relative rounded-lg outline-offset-2 transition-shadow",
        actions.selected
          ? "outline outline-2 outline-primary"
          : "outline outline-1 outline-transparent hover:outline-primary/30",
      )}
    >
      {/* Type badge */}
      <span
        className={cn(
          "pointer-events-none absolute -top-2.5 left-3 z-20 rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground transition-opacity",
          actions.selected ? "opacity-100" : "opacity-0 group-hover/eb:opacity-100",
        )}
      >
        {label}
      </span>

      {/* Toolbar */}
      <div
        className={cn(
          "absolute -top-3 right-2 z-30 flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5 shadow-sm transition-opacity",
          actions.selected ? "opacity-100" : "opacity-0 group-hover/eb:opacity-100",
        )}
      >
        {dragHandle && (
          <button
            type="button"
            className="flex size-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent active:cursor-grabbing"
            aria-label="Trascina"
            {...dragHandle.attributes}
            {...dragHandle.listeners}
          >
            <GripVertical className="size-3.5" />
          </button>
        )}
        <ToolbarButton label="Su" onClick={actions.onMoveUp}>
          <ChevronUp className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Giù" onClick={actions.onMoveDown}>
          <ChevronDown className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Impostazioni" onClick={actions.onSelect}>
          <Settings2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Duplica" onClick={actions.onDuplicate}>
          <Copy className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Elimina" onClick={actions.onDelete} danger>
          <Trash2 className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Click overlay for selection — keeps inner preview inert */}
      <button
        type="button"
        aria-label={`Seleziona ${label}`}
        onClick={actions.onSelect}
        className="absolute inset-0 z-10 cursor-pointer rounded-lg"
      />

      <div className="pointer-events-none relative">{children}</div>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-accent",
        danger && "hover:bg-destructive/10 hover:text-destructive",
      )}
    >
      {children}
    </button>
  );
}
