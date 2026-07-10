"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeRichText } from "@/lib/sanitize";
import { slugify } from "@/lib/slug";

export type PostActionState = { error?: string } | undefined;

const postSchema = z.object({
  title: z.string().trim().min(3, "Il titolo è troppo corto."),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().max(300).optional(),
  cover_url: z.string().trim().url().optional().or(z.literal("")),
  content_html: z.string().default(""),
  status: z.enum(["draft", "published"]),
});

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Ensure the slug is unique, ignoring the post being edited. */
async function uniqueSlug(
  supabase: Supabase,
  base: string,
  ignoreId?: string,
): Promise<string> {
  const root = slugify(base) || "articolo";
  let candidate = root;
  for (let i = 2; i < 50; i++) {
    const { data } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data || data.id === ignoreId) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

function parse(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    cover_url: formData.get("cover_url") || "",
    content_html: formData.get("content_html") || "",
    status: formData.get("status") || "draft",
  });
}

export async function createPost(
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }
  const d = parsed.data;

  const supabase = await createClient();
  const slug = await uniqueSlug(supabase, d.slug || d.title);

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    title: d.title,
    slug,
    excerpt: d.excerpt || null,
    cover_url: d.cover_url || null,
    content_html: sanitizeRichText(d.content_html),
    status: d.status,
    published_at: d.status === "published" ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/articoli");
  revalidatePath("/blog");
  redirect("/dashboard/articoli");
}

export async function updatePost(
  id: string,
  _prev: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dati non validi." };
  }
  const d = parsed.data;

  const supabase = await createClient();

  // Preserve the original published_at; set it when publishing for the first time.
  const { data: existing } = await supabase
    .from("posts")
    .select("published_at, status")
    .eq("id", id)
    .maybeSingle();

  const slug = await uniqueSlug(supabase, d.slug || d.title, id);
  const publishedAt =
    d.status === "published"
      ? (existing?.published_at ?? new Date().toISOString())
      : existing?.published_at ?? null;

  // RLS guarantees only the owner (or super_admin) can update this row.
  const { error } = await supabase
    .from("posts")
    .update({
      title: d.title,
      slug,
      excerpt: d.excerpt || null,
      cover_url: d.cover_url || null,
      content_html: sanitizeRichText(d.content_html),
      status: d.status,
      published_at: publishedAt,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/articoli");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/dashboard/articoli");
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/dashboard/articoli");
  revalidatePath("/blog");
}
