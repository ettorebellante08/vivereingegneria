# CLAUDE.md — Vivere Ingegneria

Next.js 16 (App Router) + Supabase site for the "Vivere Ingegneria" student
association. Italian UI. See README.md for the overview and DEPLOY.md for setup.

## Key conventions

- **No hardcoded production URL.** Canonical URL comes from `getSiteUrl()`
  (`lib/site-url.ts`), driven by `NEXT_PUBLIC_SITE_URL` / Vercel env.
- **Works before Supabase is linked.** `isSupabaseConfigured()` gates DB access;
  data helpers in `lib/data/*` fall back to bundled defaults. Keep this graceful
  degradation when adding data reads.
- **Security is enforced at the DB (RLS), not just the UI.** Any new table needs
  RLS policies in `supabase/migrations`. Role checks use the SECURITY DEFINER
  helpers (`current_app_role`, `is_super`, `is_web_admin`, `is_blogger`,
  `owns_post`) to avoid policy recursion.
- **Roles** (`app_role` enum): `member` < `blogger` < `web_admin` < `super_admin`.
  Use `roleAtLeast` (`lib/roles.ts`, client‑safe) and `requireRole` (`lib/auth.ts`,
  server) — never import `lib/auth.ts` into a client component.
- **Rich text** authored via Tiptap is **sanitised** (`sanitizeRichText`) before
  persisting, and rendered with `<Prose>`.
- Institutional email rule lives in `lib/validation.ts` (client) AND the
  `enforce_email_domain` trigger (server). The only exception is the super
  admin's gmail, kept in `email_domain_exceptions`.
- Service‑role key: only in `lib/supabase/admin.ts`, server‑only. Never
  `NEXT_PUBLIC_*`.

## Commands

```bash
npm run dev          # local dev
npm run build        # production build (run before considering work done)
npx supabase db push # apply migrations to the linked project
```

## Content status

Static‑page bodies from the old WordPress site were NOT recoverable (JS‑rendered,
empty on fetch). `content/pages.ts` marks these `needsContent: true` and the UI
shows a visible "da completare" note. Do not invent institutional copy — flag it.
