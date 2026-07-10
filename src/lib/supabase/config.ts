/**
 * Whether Supabase is wired up in the current environment.
 *
 * Lets the app render fully from bundled defaults BEFORE the project is linked
 * to Supabase (local dev / first deploy), then transparently switch to
 * live data once the env vars are present.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
