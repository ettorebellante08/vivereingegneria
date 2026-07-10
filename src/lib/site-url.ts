/**
 * Canonical site URL resolution — never hardcode the production domain.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL         (set this to https://vivereingegneria.com
 *                                    after the domain migration)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (auto-set by Vercel for the prod domain)
 *   3. VERCEL_URL                   (auto-set per-deployment, e.g. previews)
 *   4. http://localhost:3000        (local dev fallback)
 *
 * When you migrate to vivereingegneria.com, the ONLY change needed is setting
 * NEXT_PUBLIC_SITE_URL in the Vercel project env — no code edits.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;

  const deployment = process.env.VERCEL_URL;
  if (deployment) return `https://${deployment}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(url: string) {
  return url.replace(/\/+$/, "");
}
