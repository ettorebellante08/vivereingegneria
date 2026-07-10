"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { updateSettings, type AdminActionState } from "@/lib/actions/admin";
import type { SiteSettings } from "@/lib/data/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Salva impostazioni
    </Button>
  );
}

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    updateSettings,
    undefined,
  );

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      <div className="space-y-2">
        <Label htmlFor="contact_email">Email di contatto</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          defaultValue={initial.contactEmail}
          required
        />
      </div>

      <fieldset className="space-y-4 rounded-lg border border-border p-4">
        <legend className="px-1 text-sm font-medium">Social</legend>
        {(["facebook", "instagram", "linkedin", "telegram"] as const).map(
          (key) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {key}
              </Label>
              <Input
                id={key}
                name={key}
                type="url"
                defaultValue={initial.social[key]}
                placeholder="https://…"
              />
            </div>
          ),
        )}
      </fieldset>

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
