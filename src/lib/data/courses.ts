import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { COURSES } from "@/lib/site-config";

export type Course = {
  slug: string;
  name: string;
  description: string | null;
};

const fallbackCourses: Course[] = COURSES.map((c) => ({
  slug: c.slug,
  name: c.name,
  description: null,
}));

/** All degree courses, ordered. DB-backed with a config fallback. */
export async function getCourses(): Promise<Course[]> {
  if (!isSupabaseConfigured()) return fallbackCourses;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("courses")
      .select("slug, name, description")
      .order("sort_order", { ascending: true });

    if (data && data.length > 0) return data;
  } catch {
    // fall through to defaults
  }
  return fallbackCourses;
}

export async function getCourse(slug: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((c) => c.slug === slug) ?? null;
}
