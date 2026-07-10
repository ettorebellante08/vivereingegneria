import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "@/lib/actions/posts";
import { PostEditor } from "@/components/dashboard/post-editor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("blogger");
  const { id } = await params;

  const supabase = await createClient();
  // RLS ensures a blogger can only load their own post (or super any).
  const { data: post } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_url, content_html, status")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/articoli"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Articoli
      </Link>
      <h2 className="text-xl font-semibold">Modifica articolo</h2>
      <PostEditor
        action={updatePost.bind(null, post.id)}
        initial={{
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          cover_url: post.cover_url,
          content_html: post.content_html,
          status: post.status,
        }}
      />
    </div>
  );
}
