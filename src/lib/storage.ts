"use client";

import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";

const BUCKET = "media";

/**
 * Upload an image to the public `media` bucket and return its public URL.
 * Also records a row in `media` (RLS: uploader must be a blogger+).
 */
export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Devi essere autenticato per caricare immagini.");

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "img";
  const path = `posts/${user.id}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);

  await supabase.from("media").insert({ path, uploaded_by: user.id });

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
