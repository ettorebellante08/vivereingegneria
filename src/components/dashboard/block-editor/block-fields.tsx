"use client";

import { useState } from "react";
import { ImageUp, Loader2, Plus, Trash2, AlignLeft, AlignCenter } from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { cn } from "@/lib/utils";
import type { Block } from "@/lib/blocks/schema";

/** Renders the type-specific editing form for a single block. */
export function BlockFields({
  block,
  onChange,
}: {
  block: Block;
  onChange: (next: Block) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-3">
          <Input
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Testo del titolo"
            className="font-display text-lg"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              value={String(block.level)}
              options={[
                { value: "2", label: "Grande" },
                { value: "3", label: "Medio" },
              ]}
              onChange={(v) =>
                onChange({ ...block, level: Number(v) as 2 | 3 })
              }
            />
            <AlignControl
              value={block.align}
              onChange={(align) => onChange({ ...block, align })}
            />
          </div>
        </div>
      );

    case "paragraph":
      return (
        <RichTextEditor
          initialHtml={block.html}
          onChange={(html) => onChange({ ...block, html })}
        />
      );

    case "image":
      return (
        <div className="space-y-3">
          <ImageUploadField
            src={block.src}
            onUploaded={(src) => onChange({ ...block, src })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Testo alternativo</Label>
              <Input
                value={block.alt}
                onChange={(e) => onChange({ ...block, alt: e.target.value })}
                placeholder="Descrizione dell'immagine"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Didascalia (opzionale)</Label>
              <Input
                value={block.caption}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
              />
            </div>
          </div>
          <SegmentedControl
            value={block.size}
            options={[
              { value: "small", label: "Piccola" },
              { value: "medium", label: "Media" },
              { value: "full", label: "Larghezza intera" },
            ]}
            onChange={(size) =>
              onChange({ ...block, size: size as typeof block.size })
            }
          />
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {block.images.map((img, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
                {img.src && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      ...block,
                      images: block.images.filter((_, idx) => idx !== i),
                    })
                  }
                  className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Rimuovi immagine"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            <GalleryAddTile
              onUploaded={(src) =>
                onChange({ ...block, images: [...block.images, { src, alt: "" }] })
              }
            />
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="space-y-3">
          <Textarea
            value={block.text}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            placeholder="Testo della citazione"
            rows={3}
          />
          <Input
            value={block.attribution}
            onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            placeholder="Attribuzione (opzionale)"
          />
        </div>
      );

    case "divider":
      return (
        <SegmentedControl
          value={block.style}
          options={[
            { value: "line", label: "Linea" },
            { value: "space", label: "Solo spazio" },
          ]}
          onChange={(style) =>
            onChange({ ...block, style: style as typeof block.style })
          }
        />
      );

    case "button":
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Testo del pulsante</Label>
              <Input
                value={block.label}
                onChange={(e) => onChange({ ...block, label: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Link</Label>
              <Input
                value={block.href}
                onChange={(e) => onChange({ ...block, href: e.target.value })}
                placeholder="/contatti oppure https://…"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              value={block.variant}
              options={[
                { value: "primary", label: "Pieno" },
                { value: "outline", label: "Contorno" },
              ]}
              onChange={(variant) =>
                onChange({ ...block, variant: variant as typeof block.variant })
              }
            />
            <AlignControl
              value={block.align}
              onChange={(align) => onChange({ ...block, align })}
            />
          </div>
        </div>
      );

    case "spacer":
      return (
        <SegmentedControl
          value={block.size}
          options={[
            { value: "sm", label: "Piccolo" },
            { value: "md", label: "Medio" },
            { value: "lg", label: "Grande" },
          ]}
          onChange={(size) =>
            onChange({ ...block, size: size as typeof block.size })
          }
        />
      );
  }
}

function SegmentedControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function AlignControl({
  value,
  onChange,
}: {
  value: "left" | "center";
  onChange: (align: "left" | "center") => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      <button
        type="button"
        onClick={() => onChange("left")}
        aria-label="Allinea a sinistra"
        className={cn(
          "flex size-7 items-center justify-center rounded",
          value === "left"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AlignLeft className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => onChange("center")}
        aria-label="Allinea al centro"
        className={cn(
          "flex size-7 items-center justify-center rounded",
          value === "center"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <AlignCenter className="size-3.5" />
      </button>
    </div>
  );
}

function ImageUploadField({
  src,
  onUploaded,
}: {
  src: string;
  onUploaded: (src: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      onUploaded(await uploadImage(file));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload non riuscito.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-20 w-32 rounded-lg object-cover" />
      ) : (
        <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
          Nessuna immagine
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent">
        {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageUp className="size-4" />}
        {src ? "Cambia" : "Carica"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
    </div>
  );
}

function GalleryAddTile({ onUploaded }: { onUploaded: (src: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      onUploaded(await uploadImage(file));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload non riuscito.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary">
      {uploading ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
      <span className="text-[11px]">Aggiungi</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}
