"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { updateStaticPage, type AdminActionState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Salva pagina
    </Button>
  );
}

export function StaticPageEditor({
  slug,
  initialTitle,
  initialHtml,
}: {
  slug: string;
  initialTitle: string;
  initialHtml: string;
}) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    updateStaticPage.bind(null, slug),
    undefined,
  );
  const [html, setHtml] = useState(initialHtml);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="content_html" value={html} />

      <div className="space-y-2">
        <Label htmlFor="title">Titolo</Label>
        <Input id="title" name="title" defaultValue={initialTitle} required />
      </div>

      <div className="space-y-2">
        <Label>Contenuto</Label>
        <RichTextEditor initialHtml={initialHtml} onChange={setHtml} />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 text-sm text-primary">
          <CheckCircle2 className="size-4" />
          {state.ok}
        </p>
      )}

      <SaveButton />
    </form>
  );
}
