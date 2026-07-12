"use client";

import { Fragment } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings2,
} from "lucide-react";
import { BlockView, type RenderData } from "@/components/blocks/block-renderer";
import { EditableBlock, type BlockActions } from "@/components/dashboard/visual-editor/editable-block";
import { AddBlockMenu } from "@/components/dashboard/visual-editor/add-block-menu";
import { backgroundStyles, PADDING_CLASSES } from "@/lib/blocks/render-helpers";
import { BLOCK_LABELS, type Block, type BlockType, type SectionBlock } from "@/lib/blocks/schema";
import { cn } from "@/lib/utils";

export type CanvasHandlers = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onReorderTop: (activeId: string, overId: string) => void;
  onInsertTop: (index: number, type: BlockType) => void;
  onAddToColumn: (sectionId: string, columnId: string, type: BlockType) => void;
  data: RenderData;
};

export function EditorCanvas({
  blocks,
  handlers,
}: {
  blocks: Block[];
  handlers: CanvasHandlers;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handlers.onReorderTop(String(active.id), String(over.id));
    }
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block, i) => (
            <Fragment key={block.id}>
              <AddBlockMenu variant="inline" onAdd={(type) => handlers.onInsertTop(i, type)} />
              <SortableTop block={block} handlers={handlers} />
            </Fragment>
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-2">
        <AddBlockMenu
          variant="inline"
          onAdd={(type) => handlers.onInsertTop(blocks.length, type)}
        />
      </div>

      {blocks.length === 0 && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">La pagina è vuota.</p>
          <AddBlockMenu onAdd={(type) => handlers.onInsertTop(0, type)} label="Aggiungi il primo blocco" />
        </div>
      )}
    </div>
  );
}

function SortableTop({ block, handlers }: { block: Block; handlers: CanvasHandlers }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const actions = actionsFor(block.id, handlers);
  const dragHandle = {
    attributes: attributes as unknown as Record<string, unknown>,
    listeners: (listeners ?? {}) as unknown as Record<string, unknown>,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {block.type === "section" ? (
        <EditableSection
          block={block}
          handlers={handlers}
          actions={actions}
          dragHandle={dragHandle}
        />
      ) : (
        <EditableBlock label={BLOCK_LABELS[block.type]} actions={actions} dragHandle={dragHandle}>
          <div className="py-1">
            <BlockView block={block} data={handlers.data} />
          </div>
        </EditableBlock>
      )}
    </div>
  );
}

/** A section rendered with live background + editable columns. */
function EditableSection({
  block,
  handlers,
  actions,
  dragHandle,
}: {
  block: SectionBlock;
  handlers: CanvasHandlers;
  actions: BlockActions;
  dragHandle: { attributes: Record<string, unknown>; listeners?: Record<string, unknown> };
}) {
  const bg = backgroundStyles(block.background);
  const light = block.textColor === "light";
  const cols = block.columns.length || 1;

  return (
    <div
      className={cn(
        "group/eb relative rounded-lg outline-offset-2 transition-shadow",
        actions.selected
          ? "outline outline-2 outline-primary"
          : "outline outline-1 outline-dashed outline-primary/20 hover:outline-primary/40",
      )}
    >
      {/* Section toolbar (always interactive) */}
      <div className="absolute -top-3 left-3 right-2 z-30 flex items-center justify-between">
        <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Sezione
        </span>
        <div className="flex items-center gap-0.5 rounded-lg border border-border bg-background p-0.5 shadow-sm">
          <button
            type="button"
            className="flex size-6 cursor-grab items-center justify-center rounded text-muted-foreground hover:bg-accent"
            aria-label="Trascina"
            {...dragHandle.attributes}
            {...(dragHandle.listeners ?? {})}
          >
            <GripVertical className="size-3.5" />
          </button>
          <SecBtn label="Su" onClick={actions.onMoveUp}><ChevronUp className="size-3.5" /></SecBtn>
          <SecBtn label="Giù" onClick={actions.onMoveDown}><ChevronDown className="size-3.5" /></SecBtn>
          <SecBtn label="Impostazioni" onClick={actions.onSelect}><Settings2 className="size-3.5" /></SecBtn>
          <SecBtn label="Duplica" onClick={actions.onDuplicate}><Copy className="size-3.5" /></SecBtn>
          <SecBtn label="Elimina" onClick={actions.onDelete} danger><Trash2 className="size-3.5" /></SecBtn>
        </div>
      </div>

      <section
        className={cn("relative isolate overflow-hidden rounded-lg", PADDING_CLASSES[block.padding])}
        style={bg.containerStyle}
        onClick={(e) => {
          if (e.target === e.currentTarget) actions.onSelect();
        }}
      >
        {bg.imageSrc && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bg.imageSrc} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div aria-hidden className="absolute inset-0 -z-10" style={bg.overlayStyle} />
          </>
        )}
        <div className={cn("px-4", light && "text-white [&_h2]:text-white [&_h3]:text-white")}>
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${Math.min(cols, 3)}, minmax(0, 1fr))` }}
          >
            {block.columns.map((column) => (
              <div key={column.id} className="min-h-[4rem] space-y-3 rounded-md">
                {column.blocks.map((leaf) => (
                  <EditableBlock
                    key={leaf.id}
                    label={BLOCK_LABELS[leaf.type]}
                    actions={actionsFor(leaf.id, handlers)}
                  >
                    <BlockView block={leaf} data={handlers.data} />
                  </EditableBlock>
                ))}
                <AddBlockMenu
                  variant="inline"
                  label="Aggiungi qui"
                  exclude={["section"]}
                  onAdd={(type) => handlers.onAddToColumn(block.id, column.id, type)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SecBtn({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
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

function actionsFor(id: string, handlers: CanvasHandlers): BlockActions {
  return {
    selected: handlers.selectedId === id,
    onSelect: () => handlers.onSelect(id),
    onDuplicate: () => handlers.onDuplicate(id),
    onDelete: () => handlers.onDelete(id),
    onMoveUp: () => handlers.onMove(id, -1),
    onMoveDown: () => handlers.onMove(id, 1),
  };
}
