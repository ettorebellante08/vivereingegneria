"use client";

import { useState, useTransition } from "react";
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
  arrayMove,
} from "@dnd-kit/sortable";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { saveStaticPageBlocks, type BlocksActionState } from "@/lib/actions/blocks";
import { createBlock, type Block, type BlockType } from "@/lib/blocks/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SortableBlock } from "@/components/dashboard/block-editor/sortable-block";
import { AddBlockMenu } from "@/components/dashboard/block-editor/add-block-menu";

export function BlockEditor({
  slug,
  initialTitle,
  initialBlocks,
}: {
  slug: string;
  initialTitle: string;
  initialBlocks: Block[];
}) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<BlocksActionState>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((items) => {
      const oldIndex = items.findIndex((b) => b.id === active.id);
      const newIndex = items.findIndex((b) => b.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }

  function updateBlock(id: string, next: Block) {
    setBlocks((items) => items.map((b) => (b.id === id ? next : b)));
  }

  function duplicateBlock(id: string) {
    setBlocks((items) => {
      const idx = items.findIndex((b) => b.id === id);
      if (idx === -1) return items;
      const copy = { ...items[idx], id: crypto.randomUUID() };
      return [...items.slice(0, idx + 1), copy, ...items.slice(idx + 1)];
    });
  }

  function deleteBlock(id: string) {
    setBlocks((items) => items.filter((b) => b.id !== id));
  }

  function addBlock(type: BlockType) {
    setBlocks((items) => [...items, createBlock(type)]);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await saveStaticPageBlocks(slug, title, blocks);
      setResult(res);
    });
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="page-title">Titolo della pagina</Label>
        <Input
          id="page-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onChange={(next) => updateBlock(block.id, next)}
                onDuplicate={() => duplicateBlock(block.id)}
                onDelete={() => deleteBlock(block.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddBlockMenu onAdd={addBlock} />

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <Button onClick={handleSave} disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Salva pagina
        </Button>
        {result?.error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {result.error}
          </p>
        )}
        {result?.ok && (
          <p className="flex items-center gap-2 text-sm text-primary">
            <CheckCircle2 className="size-4" />
            {result.ok}
          </p>
        )}
      </div>
    </div>
  );
}
