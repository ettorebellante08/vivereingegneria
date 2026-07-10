"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { changePasswordAction, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Salvataggio…" : "Imposta nuova password"}
    </Button>
  );
}

export function ChangePasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nuova password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <p className="text-xs text-muted-foreground">
          Almeno 10 caratteri, con maiuscole, minuscole e numeri.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm">Conferma password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {state?.error && (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" />
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
