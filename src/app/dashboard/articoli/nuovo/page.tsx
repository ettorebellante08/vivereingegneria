import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createPost } from "@/lib/actions/posts";
import { PostEditor } from "@/components/dashboard/post-editor";

export default async function NewPostPage() {
  await requireRole("blogger");

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/articoli"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Articoli
      </Link>
      <h2 className="text-xl font-semibold">Nuovo articolo</h2>
      <PostEditor action={createPost} />
    </div>
  );
}
