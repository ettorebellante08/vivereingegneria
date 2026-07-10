import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Service-role Supabase client — BYPASSES Row Level Security.
 *
 * Use ONLY in trusted server-side code (Server Actions / Route Handlers /
 * scripts) for privileged operations that RLS intentionally forbids, e.g. the
 * super_admin creating users or assigning roles.
 *
 * NEVER import this into a Client Component. The service role key must only
 * ever exist in server env (SUPABASE_SERVICE_ROLE_KEY) — never NEXT_PUBLIC_*.
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set — admin client unavailable.",
    );
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
