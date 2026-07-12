"use client";

import { useState } from "react";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageUp,
  Loader2,
} from "lucide-react";
import { uploadImage } from "@/lib/storage";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { BlockBackground } from "@/lib/blocks/schema";

/** A labelled block in the settings panel. */
export function Field({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap rounded-md border border-border p-0.5">
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

const ALIGN_ICONS = { left: AlignLeft, center: AlignCenter, right: AlignRight } as const;

export function AlignControl({
  value,
  onChange,
  options = ["left", "center", "right"],
}: {
  value: "left" | "center" | "right";
  onChange: (align: "left" | "center" | "right") => void;
  options?: ("left" | "center" | "right")[];
}) {
  return (
    <div className="inline-flex rounded-md border border-border p-0.5">
      {options.map((opt) => {
        const Icon = ALIGN_ICONS[opt];
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-label={`Allinea ${opt}`}
            className={cn(
              "flex size-7 items-center justify-center rounded",
              value === opt
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
          </button>
        );
      })}
    </div>
  );
}

/** Compact image upload + preview used across block fields. */
export function ImageUploadField({
  src,
  onUploaded,
  onClear,
  aspect = "h-20 w-32",
}: {
  src: string;
  onUploaded: (src: string) => void;
  onClear?: () => void;
  aspect?: string;
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
    <div className="flex items-center gap-3">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className={cn("rounded-lg object-cover", aspect)} />
      ) : (
        <div
          className={cn(
            "flex items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground",
            aspect,
          )}
        >
          Nessuna
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent">
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
        {src && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-left text-xs text-muted-foreground hover:text-destructive"
          >
            Rimuovi
          </button>
        )}
      </div>
    </div>
  );
}

/** Full background editor: none / colour / image + opaque overlay controls. */
export function BackgroundControl({
  value,
  onChange,
}: {
  value: BlockBackground;
  onChange: (bg: BlockBackground) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border p-3">
      <Field label="Sfondo">
        <SegmentedControl
          value={value.type}
          options={[
            { value: "none", label: "Nessuno" },
            { value: "color", label: "Colore" },
            { value: "image", label: "Immagine" },
          ]}
          onChange={(type) => onChange({ ...value, type })}
        />
      </Field>

      {value.type === "color" && (
        <Field label="Colore">
          <input
            type="color"
            value={value.color || "#071d99"}
            onChange={(e) => onChange({ ...value, color: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-md border border-border bg-transparent"
          />
        </Field>
      )}

      {value.type === "image" && (
        <>
          <Field label="Immagine di sfondo">
            <ImageUploadField
              src={value.image}
              onUploaded={(image) => onChange({ ...value, image })}
              onClear={() => onChange({ ...value, image: "" })}
            />
          </Field>
          <Field label="Colore filtro">
            <SegmentedControl
              value={value.overlayColor}
              options={[
                { value: "ink", label: "Scuro" },
                { value: "brand", label: "Blu" },
                { value: "light", label: "Chiaro" },
              ]}
              onChange={(overlayColor) => onChange({ ...value, overlayColor })}
            />
          </Field>
          <Field label={`Opacità filtro: ${value.overlay}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={value.overlay}
              onChange={(e) => onChange({ ...value, overlay: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </Field>
        </>
      )}
    </div>
  );
}
