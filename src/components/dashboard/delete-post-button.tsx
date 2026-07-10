"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "@/lib/actions/posts";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm(`Eliminare definitivamente «${title}»?`)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        title="Elimina"
        aria-label="Elimina"
        className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive [&_svg]:size-4"
      >
        <Trash2 />
      </button>
    </form>
  );
}
