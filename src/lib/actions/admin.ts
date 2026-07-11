"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth";
import { institutionalEmailSchema } from "@/lib/validation";
import type { AppRole } from "@/lib/database.types";

export type AdminActionState =
  | { error?: string; ok?: string; password?: string; email?: string }
  | undefined;

// ---------- Site settings (web_admin) --------------------------------
const settingsSchema = z.object({
  contact_email: z.string().email("Email di contatto non valida."),
  facebook: z.string().url().or(z.literal("")),
  instagram: z.string().url().or(z.literal("")),
  linkedin: z.string().url().or(z.literal("")),
  telegram: z.string().url().or(z.literal("")),
});

export async function updateSettings(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const user = await requireRole("web_admin");

  const parsed = settingsSchema.safeParse({
    contact_email: formData.get("contact_email"),
    facebook: formData.get("facebook") || "",
    instagram: formData.get("instagram") || "",
    linkedin: formData.get("linkedin") || "",
    telegram: formData.get("telegram") || "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert(
    [
      { key: "contact_email", value: d.contact_email, updated_by: user.id },
      {
        key: "social",
        value: {
          facebook: d.facebook,
          instagram: d.instagram,
          linkedin: d.linkedin,
          telegram: d.telegram,
        },
        updated_by: user.id,
      },
    ],
    { onConflict: "key" },
  );
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { ok: "Impostazioni salvate." };
}

// ---------- Users & roles (super_admin) ------------------------------
const ROLES: AppRole[] = ["member", "blogger", "web_admin", "super_admin"];

export async function createUserAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireRole("super_admin");

  const emailResult = institutionalEmailSchema.safeParse(formData.get("email"));
  if (!emailResult.success) {
    return { error: emailResult.error.issues[0]?.message };
  }
  const role = String(formData.get("role") || "");
  if (!ROLES.includes(role as AppRole)) return { error: "Ruolo non valido." };
  const fullName = String(formData.get("full_name") || "").trim();

  const password = randomBytes(18).toString("base64url");
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email: emailResult.data,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName || null,
      initial_role: role,
      must_change_password: true,
    },
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard/utenti");
  return {
    ok: "Utente creato.",
    email: emailResult.data,
    password, // shown once in the UI; never persisted
  };
}

export async function updateUserRoleAction(
  userId: string,
  formData: FormData,
): Promise<void> {
  await requireRole("super_admin");
  const role = String(formData.get("role") || "");
  if (!ROLES.includes(role as AppRole)) return;

  const admin = createAdminClient();
  await admin.from("profiles").update({ role: role as AppRole }).eq("id", userId);
  revalidatePath("/dashboard/utenti");
}
