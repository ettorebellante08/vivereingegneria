import { arrayMove } from "@dnd-kit/sortable";
import type { Block, LeafBlock, SectionBlock } from "@/lib/blocks/schema";

/**
 * Pure helpers for mutating a block tree. Blocks are a flat ordered list where
 * a `section` block nests columns of leaf blocks (one level deep). Every block
 * has a globally-unique `id`, so selection/update/delete work by id regardless
 * of nesting.
 */

function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `blk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const isSection = (b: Block): b is SectionBlock => b.type === "section";

/** Find a block by id anywhere in the tree. */
export function findBlock(blocks: Block[], id: string): Block | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (isSection(b)) {
      for (const col of b.columns) {
        const found = col.blocks.find((lb) => lb.id === id);
        if (found) return found;
      }
    }
  }
  return null;
}

/** Replace the block with `id` (anywhere) with `next`. */
export function updateBlockById(blocks: Block[], id: string, next: Block): Block[] {
  return blocks.map((b) => {
    if (b.id === id) return next;
    if (isSection(b)) {
      return {
        ...b,
        columns: b.columns.map((col) => ({
          ...col,
          blocks: col.blocks.map((lb) => (lb.id === id ? (next as LeafBlock) : lb)),
        })),
      };
    }
    return b;
  });
}

/** Remove the block with `id` (anywhere). */
export function removeBlockById(blocks: Block[], id: string): Block[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) =>
      isSection(b)
        ? {
            ...b,
            columns: b.columns.map((col) => ({
              ...col,
              blocks: col.blocks.filter((lb) => lb.id !== id),
            })),
          }
        : b,
    );
}

/** Deep-clone a block with freshly-generated ids (block + any nested). */
export function cloneWithNewIds<T extends Block>(block: T): T {
  const clone = structuredCloneSafe(block);
  clone.id = newId();
  if (isSection(clone)) {
    clone.columns = clone.columns.map((col) => ({
      id: newId(),
      blocks: col.blocks.map((lb) => ({ ...lb, id: newId() })),
    }));
  }
  return clone;
}

/** Duplicate the block with `id`, inserting the copy right after it. */
export function duplicateBlockById(blocks: Block[], id: string): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    if (b.id === id) {
      out.push(b, cloneWithNewIds(b));
      continue;
    }
    if (isSection(b)) {
      const columns = b.columns.map((col) => {
        const idx = col.blocks.findIndex((lb) => lb.id === id);
        if (idx === -1) return col;
        const copy = cloneWithNewIds(col.blocks[idx]);
        return {
          ...col,
          blocks: [...col.blocks.slice(0, idx + 1), copy, ...col.blocks.slice(idx + 1)],
        };
      });
      out.push({ ...b, columns });
      continue;
    }
    out.push(b);
  }
  return out;
}

/** Move a block up/down within its own container (top level or a column). */
export function moveBlockById(blocks: Block[], id: string, dir: -1 | 1): Block[] {
  const topIdx = blocks.findIndex((b) => b.id === id);
  if (topIdx !== -1) {
    const target = topIdx + dir;
    if (target < 0 || target >= blocks.length) return blocks;
    return arrayMove(blocks, topIdx, target);
  }
  return blocks.map((b) => {
    if (!isSection(b)) return b;
    return {
      ...b,
      columns: b.columns.map((col) => {
        const idx = col.blocks.findIndex((lb) => lb.id === id);
        if (idx === -1) return col;
        const target = idx + dir;
        if (target < 0 || target >= col.blocks.length) return col;
        return { ...col, blocks: arrayMove(col.blocks, idx, target) };
      }),
    };
  });
}

/** Insert a top-level block at `index`. */
export function insertBlockAt(blocks: Block[], index: number, block: Block): Block[] {
  return [...blocks.slice(0, index), block, ...blocks.slice(index)];
}

/** Append a leaf block to a specific column of a section. */
export function addToColumn(
  blocks: Block[],
  sectionId: string,
  columnId: string,
  block: LeafBlock,
): Block[] {
  return blocks.map((b) => {
    if (b.id !== sectionId || !isSection(b)) return b;
    return {
      ...b,
      columns: b.columns.map((col) =>
        col.id === columnId ? { ...col, blocks: [...col.blocks, block] } : col,
      ),
    };
  });
}

/** Reorder top-level blocks by dragged/target ids. */
export function reorderTopLevel(blocks: Block[], activeId: string, overId: string): Block[] {
  const from = blocks.findIndex((b) => b.id === activeId);
  const to = blocks.findIndex((b) => b.id === overId);
  if (from === -1 || to === -1) return blocks;
  return arrayMove(blocks, from, to);
}

function structuredCloneSafe<T>(value: T): T {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : (JSON.parse(JSON.stringify(value)) as T);
}
