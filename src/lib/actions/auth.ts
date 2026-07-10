"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { changePasswordSchema, loginSchema } from "@/lib/validation";

export type ActionState = { error?: string } | undefined;

/** Email/password sign-in. Redirects to `redirectTo` (or /dashboard). */
export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { error: "Email o password non corretti." };
  }

  const redirectTo = String(formData.get("redirect") || "/dashboard");
  // Only allow same-site relative redirects.
  const safe = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  redirect(safe);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Change the current user's password and clear the must-change flag. */
export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = changePasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { error: error.message || "Impossibile aggiornare la password." };
  }

  // Clear the forced-change flag (SECURITY DEFINER, scoped to self).
  await supabase.rpc("complete_password_change");

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
