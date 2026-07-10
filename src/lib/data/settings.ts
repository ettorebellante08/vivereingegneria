import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CONTACT } from "@/lib/site-config";

export type SiteSettings = {
  contactEmail: string;
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    telegram: string;
  };
};

const fallback: SiteSettings = {
  contactEmail: CONTACT.email,
  social: { ...CONTACT.social },
};

/** Site-wide settings with a config fallback (works before Supabase is linked). */
export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return fallback;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["contact_email", "social"]);

    const map = new Map((data ?? []).map((r) => [r.key, r.value]));
    const email = map.get("contact_email");
    const social = map.get("social") as Partial<SiteSettings["social"]> | undefined;

    return {
      contactEmail: typeof email === "string" ? email : fallback.contactEmail,
      social: { ...fallback.social, ...(social ?? {}) },
    };
  } catch {
    return fallback;
  }
}
