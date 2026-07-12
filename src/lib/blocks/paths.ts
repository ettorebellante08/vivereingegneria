/** Reserved static-page slugs and the public URL they map to. */
export const HOME_SLUG = "home";
export const COURSE_SLUG_PREFIX = "corso:";

export function courseStorageSlug(courseSlug: string): string {
  return `${COURSE_SLUG_PREFIX}${courseSlug}`;
}

/** Public URL a stored page slug maps to (home / course / plain slug). */
export function publicPathForSlug(slug: string): string {
  if (slug === HOME_SLUG) return "/";
  if (slug.startsWith(COURSE_SLUG_PREFIX)) {
    return `/corsi/${slug.slice(COURSE_SLUG_PREFIX.length)}`;
  }
  return `/${slug}`;
}
