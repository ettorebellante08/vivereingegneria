"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import {
  Field,
  SegmentedControl,
  AlignControl,
  ImageUploadField,
  BackgroundControl,
} from "@/components/dashboard/visual-editor/field-controls";
import { LinkField } from "@/components/dashboard/visual-editor/link-field";
import { BLOCK_LABELS, createColumn, type Block } from "@/lib/blocks/schema";

/** Per-type settings form for the selected block, shown in the side panel. */
export function SettingsPanel({
  block,
  onChange,
}: {
  block: Block;
  onChange: (next: Block) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {BLOCK_LABELS[block.type]}
      </p>
      <Fields block={block} onChange={onChange} />
    </div>
  );
}

function Fields({
  block,
  onChange,
}: {
  block: Block;
  onChange: (next: Block) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <>
          <Field label="Testo">
            <Input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              className="font-display"
            />
          </Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Dimensione">
              <SegmentedControl
                value={String(block.level) as "2" | "3"}
                options={[
                  { value: "2", label: "Grande" },
                  { value: "3", label: "Medio" },
                ]}
                onChange={(v) => onChange({ ...block, level: Number(v) as 2 | 3 })}
              />
            </Field>
            <Field label="Allineamento">
              <AlignControl value={block.align} onChange={(align) => onChange({ ...block, align })} />
            </Field>
          </div>
        </>
      );

    case "paragraph":
      return (
        <Field label="Testo">
          <RichTextEditor
            initialHtml={block.html}
            onChange={(html) => onChange({ ...block, html })}
          />
        </Field>
      );

    case "image":
      return (
        <>
          <Field label="Immagine">
            <ImageUploadField
              src={block.src}
              onUploaded={(src) => onChange({ ...block, src })}
              onClear={() => onChange({ ...block, src: "" })}
            />
          </Field>
          <Field label="Testo alternativo">
            <Input value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} />
          </Field>
          <Field label="Didascalia">
            <Input
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </Field>
          <Field label="Larghezza">
            <SegmentedControl
              value={block.size}
              options={[
                { value: "small", label: "Piccola" },
                { value: "medium", label: "Media" },
                { value: "full", label: "Intera" },
              ]}
              onChange={(size) => onChange({ ...block, size })}
            />
          </Field>
          <Field label="Angoli">
            <SegmentedControl
              value={block.rounded ? "yes" : "no"}
              options={[
                { value: "yes", label: "Arrotondati" },
                { value: "no", label: "Squadrati" },
              ]}
              onChange={(v) => onChange({ ...block, rounded: v === "yes" })}
            />
          </Field>
        </>
      );

    case "gallery":
      return (
        <>
          <Field label="Colonne">
            <SegmentedControl
              value={String(block.columns) as "2" | "3" | "4"}
              options={[
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
              onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
            />
          </Field>
          <ItemList
            label="Immagini"
            items={block.images}
            onAdd={() => onChange({ ...block, images: [...block.images, { src: "", alt: "" }] })}
            onRemove={(i) =>
              onChange({ ...block, images: block.images.filter((_, idx) => idx !== i) })
            }
            render={(img, i) => (
              <ImageUploadField
                src={img.src}
                onUploaded={(src) =>
                  onChange({
                    ...block,
                    images: block.images.map((im, idx) => (idx === i ? { ...im, src } : im)),
                  })
                }
              />
            )}
          />
        </>
      );

    case "quote":
      return (
        <>
          <Field label="Citazione">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={3}
            />
          </Field>
          <Field label="Attribuzione">
            <Input
              value={block.attribution}
              onChange={(e) => onChange({ ...block, attribution: e.target.value })}
            />
          </Field>
        </>
      );

    case "divider":
      return (
        <Field label="Stile">
          <SegmentedControl
            value={block.style}
            options={[
              { value: "line", label: "Linea" },
              { value: "dots", label: "Punti" },
              { value: "space", label: "Spazio" },
            ]}
            onChange={(style) => onChange({ ...block, style })}
          />
        </Field>
      );

    case "button":
      return (
        <>
          <Field label="Testo">
            <Input
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
            />
          </Field>
          <Field label="Link">
            <LinkField value={block.href} onChange={(href) => onChange({ ...block, href })} />
          </Field>
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Stile">
              <SegmentedControl
                value={block.variant}
                options={[
                  { value: "primary", label: "Pieno" },
                  { value: "outline", label: "Contorno" },
                  { value: "ghost", label: "Testo" },
                ]}
                onChange={(variant) => onChange({ ...block, variant })}
              />
            </Field>
            <Field label="Allineamento">
              <AlignControl value={block.align} onChange={(align) => onChange({ ...block, align })} />
            </Field>
          </div>
        </>
      );

    case "spacer":
      return (
        <Field label="Altezza">
          <SegmentedControl
            value={block.size}
            options={[
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
              { value: "xl", label: "XL" },
            ]}
            onChange={(size) => onChange({ ...block, size })}
          />
        </Field>
      );

    case "cover":
      return (
        <>
          <Field label="Occhiello">
            <Input
              value={block.eyebrow}
              onChange={(e) => onChange({ ...block, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Titolo">
            <Input
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
              className="font-display"
            />
          </Field>
          <Field label="Sottotitolo">
            <Textarea
              value={block.subtitle}
              onChange={(e) => onChange({ ...block, subtitle: e.target.value })}
              rows={2}
            />
          </Field>
          <BackgroundControl
            value={block.background}
            onChange={(background) => onChange({ ...block, background })}
          />
          <Field label="Testo pulsante (vuoto = nessuno)">
            <Input
              value={block.buttonLabel}
              onChange={(e) => onChange({ ...block, buttonLabel: e.target.value })}
            />
          </Field>
          {block.buttonLabel && (
            <Field label="Link pulsante">
              <LinkField
                value={block.buttonHref}
                onChange={(buttonHref) => onChange({ ...block, buttonHref })}
              />
            </Field>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <Field label="Allineamento">
              <AlignControl
                value={block.align}
                onChange={(align) => onChange({ ...block, align })}
                options={["left", "center"]}
              />
            </Field>
            <Field label="Altezza">
              <SegmentedControl
                value={block.minHeight}
                options={[
                  { value: "sm", label: "Bassa" },
                  { value: "md", label: "Media" },
                  { value: "lg", label: "Alta" },
                ]}
                onChange={(minHeight) => onChange({ ...block, minHeight })}
              />
            </Field>
          </div>
        </>
      );

    case "cards":
      return (
        <>
          <Field label="Colonne">
            <SegmentedControl
              value={String(block.columns) as "2" | "3" | "4"}
              options={[
                { value: "2", label: "2" },
                { value: "3", label: "3" },
                { value: "4", label: "4" },
              ]}
              onChange={(v) => onChange({ ...block, columns: Number(v) as 2 | 3 | 4 })}
            />
          </Field>
          <ItemList
            label="Card"
            items={block.items}
            onAdd={() =>
              onChange({
                ...block,
                items: [...block.items, { icon: "", image: "", title: "", text: "", href: "" }],
              })
            }
            onRemove={(i) =>
              onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) })
            }
            render={(item, i) => {
              const set = (patch: Partial<typeof item>) =>
                onChange({
                  ...block,
                  items: block.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
                });
              return (
                <div className="space-y-2">
                  <ImageUploadField
                    src={item.image}
                    onUploaded={(image) => set({ image })}
                    onClear={() => set({ image: "" })}
                  />
                  <Input
                    value={item.icon}
                    onChange={(e) => set({ icon: e.target.value })}
                    placeholder="Emoji/icona (se nessuna immagine)"
                  />
                  <Input
                    value={item.title}
                    onChange={(e) => set({ title: e.target.value })}
                    placeholder="Titolo"
                  />
                  <Textarea
                    value={item.text}
                    onChange={(e) => set({ text: e.target.value })}
                    placeholder="Descrizione"
                    rows={2}
                  />
                  <LinkField value={item.href} onChange={(href) => set({ href })} />
                </div>
              );
            }}
          />
        </>
      );

    case "accordion":
      return (
        <ItemList
          label="Voci"
          items={block.items}
          onAdd={() => onChange({ ...block, items: [...block.items, { title: "", body: "" }] })}
          onRemove={(i) =>
            onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) })
          }
          render={(item, i) => {
            const set = (patch: Partial<typeof item>) =>
              onChange({
                ...block,
                items: block.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
              });
            return (
              <div className="space-y-2">
                <Input
                  value={item.title}
                  onChange={(e) => set({ title: e.target.value })}
                  placeholder="Domanda / titolo"
                />
                <Textarea
                  value={item.body}
                  onChange={(e) => set({ body: e.target.value })}
                  placeholder="Risposta"
                  rows={3}
                />
              </div>
            );
          }}
        />
      );

    case "stats":
      return (
        <ItemList
          label="Numeri"
          items={block.items}
          onAdd={() =>
            onChange({ ...block, items: [...block.items, { value: 0, suffix: "", label: "" }] })
          }
          onRemove={(i) =>
            onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) })
          }
          render={(item, i) => {
            const set = (patch: Partial<typeof item>) =>
              onChange({
                ...block,
                items: block.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
              });
            return (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={item.value}
                    onChange={(e) => set({ value: Number(e.target.value) })}
                    placeholder="Valore"
                  />
                  <Input
                    value={item.suffix}
                    onChange={(e) => set({ suffix: e.target.value })}
                    placeholder="+ / %"
                    className="w-20"
                  />
                </div>
                <Input
                  value={item.label}
                  onChange={(e) => set({ label: e.target.value })}
                  placeholder="Etichetta"
                />
              </div>
            );
          }}
        />
      );

    case "video":
      return (
        <>
          <Field label="Link YouTube o Vimeo">
            <Input
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://youtube.com/watch?v=…"
            />
          </Field>
          <Field label="Didascalia">
            <Input
              value={block.caption}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </Field>
        </>
      );

    case "callout":
      return (
        <>
          <Field label="Tipo">
            <SegmentedControl
              value={block.variant}
              options={[
                { value: "brand", label: "Blu" },
                { value: "info", label: "Info" },
                { value: "success", label: "OK" },
                { value: "warning", label: "Avviso" },
              ]}
              onChange={(variant) => onChange({ ...block, variant })}
            />
          </Field>
          <Field label="Titolo">
            <Input
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
            />
          </Field>
          <Field label="Testo">
            <Textarea
              value={block.body}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
              rows={3}
            />
          </Field>
        </>
      );

    case "latestPosts":
      return (
        <>
          <Field label="Titolo sezione">
            <Input
              value={block.heading}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label={`Numero di articoli: ${block.count}`}>
            <input
              type="range"
              min={1}
              max={9}
              value={block.count}
              onChange={(e) => onChange({ ...block, count: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </Field>
        </>
      );

    case "coursesList":
      return (
        <Field label="Titolo sezione">
          <Input
            value={block.heading}
            onChange={(e) => onChange({ ...block, heading: e.target.value })}
          />
        </Field>
      );

    case "photoGallery":
      return (
        <Field label="Titolo sezione (opzionale)">
          <Input
            value={block.heading}
            onChange={(e) => onChange({ ...block, heading: e.target.value })}
          />
        </Field>
      );

    case "ctaBanner":
      return (
        <>
          <Field label="Titolo">
            <Input
              value={block.title}
              onChange={(e) => onChange({ ...block, title: e.target.value })}
            />
          </Field>
          <Field label="Testo">
            <Textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              rows={2}
            />
          </Field>
          <Field label="Testo pulsante">
            <Input
              value={block.buttonLabel}
              onChange={(e) => onChange({ ...block, buttonLabel: e.target.value })}
            />
          </Field>
          <Field label="Link pulsante">
            <LinkField
              value={block.buttonHref}
              onChange={(buttonHref) => onChange({ ...block, buttonHref })}
            />
          </Field>
        </>
      );

    case "section":
      return (
        <>
          <BackgroundControl
            value={block.background}
            onChange={(background) => onChange({ ...block, background })}
          />
          <Field label="Colore testo">
            <SegmentedControl
              value={block.textColor}
              options={[
                { value: "default", label: "Scuro" },
                { value: "light", label: "Chiaro" },
              ]}
              onChange={(textColor) => onChange({ ...block, textColor })}
            />
          </Field>
          <Field label="Spaziatura">
            <SegmentedControl
              value={block.padding}
              options={[
                { value: "none", label: "No" },
                { value: "sm", label: "S" },
                { value: "md", label: "M" },
                { value: "lg", label: "L" },
              ]}
              onChange={(padding) => onChange({ ...block, padding })}
            />
          </Field>
          <Field label="Larghezza">
            <SegmentedControl
              value={block.width}
              options={[
                { value: "contained", label: "Contenuta" },
                { value: "full", label: "Intera" },
              ]}
              onChange={(width) => onChange({ ...block, width })}
            />
          </Field>
          <Field label={`Colonne: ${block.columns.length}`}>
            <SegmentedControl
              value={String(Math.min(block.columns.length, 3)) as "1" | "2" | "3"}
              options={[
                { value: "1", label: "1" },
                { value: "2", label: "2" },
                { value: "3", label: "3" },
              ]}
              onChange={(v) => {
                const target = Number(v);
                const cols = [...block.columns];
                while (cols.length < target) cols.push(createColumn());
                while (cols.length > target) cols.pop();
                onChange({ ...block, columns: cols });
              }}
            />
          </Field>
          <p className="text-xs text-muted-foreground">
            Aggiungi blocchi dentro le colonne direttamente sull&apos;anteprima.
          </p>
        </>
      );
  }
}

/** Reusable add/remove list for repeatable sub-items (images, cards, …). */
function ItemList<T>({
  label,
  items,
  onAdd,
  onRemove,
  render,
}: {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  render: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {items.map((item, i) => (
        <div key={i} className="relative rounded-lg border border-border p-3 pr-9">
          <div className="absolute right-2 top-2 flex items-center gap-1 text-muted-foreground">
            <GripVertical className="size-3.5 opacity-40" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="hover:text-destructive"
              aria-label="Rimuovi"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
          {render(item, i)}
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" /> Aggiungi
      </button>
    </div>
  );
}
