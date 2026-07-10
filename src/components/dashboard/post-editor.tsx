"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ImageUp, Loader2 } from "lucide-react";
import type { PostActionState } from "@/lib/actions/posts";
import { uploadImage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

export type PostInitial = {
  title?: string;
  slug?: string;
  excerpt?: string | null;
  cover_url?: string | null;
  content_html?: string | null;
  status?: "draft" | "published";
};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Salva
    </Button>
  );
}

export function PostEditor({
  action,
  initial,
}: {
  action: (state: PostActionState, formData: FormData) => Promise<PostActionState>;
  initial?: PostInitial;
}) {
  const [state, formAction] = useActionState<PostActionState, FormData>(
    action,
    undefined,
  );
  const [html, setHtml] = useState(initial?.content_html ?? "");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? "");
  const [uploadingCover, setUploadingCover] = useState(false);

  async function onCoverChange(file: File) {
    setUploadingCover(true);
    try {
      setCoverUrl(await uploadImage(file));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload non riuscito.");
    } finally {
      setUploadingCover(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="content_html" value={html} />
      <input type="hidden" name="cover_url" value={coverUrl} />

      <div className="space-y-2">
        <Label htmlFor="title">Titolo</Label>
        <Input
          id="title"
          name="title"
          defaultValue={initial?.title}
          required
          placeholder="Titolo dell'articolo"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (opzionale)</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={initial?.slug}
            placeholder="generato-dal-titolo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Stato</Label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "draft"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <option value="draft">Bozza</option>
            <option value="published">Pubblicato</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Estratto (opzionale)</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={initial?.excerpt ?? ""}
          placeholder="Breve riassunto mostrato nell'elenco articoli."
          maxLength={300}
        />
      </div>

      <div className="space-y-2">
        <Label>Immagine di copertina (opzionale)</Label>
        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
            {uploadingCover ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImageUp className="size-4" />
            )}
            Carica
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onCoverChange(f);
                e.target.value = "";
              }}
            />
          </label>
          {coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt="Anteprima copertina"
              className="h-14 w-24 rounded-md object-cover"
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Contenuto</Label>
        <RichTextEditor initialHtml={initial?.content_html ?? ""} onChange={setHtml} />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {state.error}
        </p>
      )}

      <SaveButton />
    </form>
  );
}
