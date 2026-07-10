"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Copy, Loader2 } from "lucide-react";
import { createUserAction, type AdminActionState } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="animate-spin" />}
      Crea utente
    </Button>
  );
}

export function CreateUserForm() {
  const [state, formAction] = useActionState<AdminActionState, FormData>(
    createUserAction,
    undefined,
  );

  return (
    <div className="space-y-4">
      <form action={formAction} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nome.cognome@community.unipa.it"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="full_name">Nome (opzionale)</Label>
          <Input id="full_name" name="full_name" placeholder="Nome Cognome" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Ruolo</Label>
          <select
            id="role"
            name="role"
            defaultValue="blogger"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <option value="blogger">Blogger</option>
            <option value="web_admin">Amministratore WEB</option>
            <option value="super_admin">Amministratore supremo</option>
            <option value="member">Membro (nessun permesso)</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <SubmitButton />
        </div>
      </form>

      {state?.error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {state.error}
        </p>
      )}

      {state?.ok && state.password && (
        <div className="rounded-lg border border-primary/40 bg-secondary p-4 text-sm">
          <p className="font-semibold">Utente creato: {state.email}</p>
          <p className="mt-1 text-muted-foreground">
            Password temporanea (mostrata una sola volta — copiala e inviala in
            modo sicuro). L&apos;utente dovrà cambiarla al primo accesso.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="rounded bg-background px-2 py-1 font-mono text-xs">
              {state.password}
            </code>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(state.password!)}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Copy className="size-3" />
              Copia
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
