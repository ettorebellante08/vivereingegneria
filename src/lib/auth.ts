import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AppRole } from "@/lib/database.types";
import { roleAtLeast } from "@/lib/roles";

// Re-export the client-safe helper for server callers' convenience.
export { roleAtLeast } from "@/lib/roles";

export type CurrentUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: AppRole;
  mustChangePassword: boolean;
};

/** The signed-in user + profile, or null. Safe to call anywhere server-side. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, must_change_password")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    role: (profile?.role ?? "member") as AppRole,
    mustChangePassword: profile?.must_change_password ?? false,
  };
}

/**
 * Require an authenticated user of at least `min` role. Redirects to /login
 * when signed out, and to /dashboard/cambia-password when a password change
 * is pending (unless we're already on that page — pass allowPasswordChange).
 */
export async function requireRole(
  min: AppRole,
  opts: { allowPasswordChange?: boolean } = {},
): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  if (user.mustChangePassword && !opts.allowPasswordChange) {
    redirect("/dashboard/cambia-password");
  }

  if (!roleAtLeast(user.role, min)) redirect("/dashboard");
  return user;
}
