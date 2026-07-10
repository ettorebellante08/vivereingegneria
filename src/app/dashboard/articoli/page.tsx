import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data/posts";
import { Button } from "@/components/ui/button";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";

export default async function ArticoliPage() {
  const user = await requireRole("blogger");
  const supabase = await createClient();

  // RLS returns the caller's own posts (+ published by others, + all for
  // super). Non-super users see only their own drafts; we narrow the list to
  // authored posts for everyone except super_admin.
  let query = supabase
    .from("posts")
    .select("id, title, slug, status, updated_at, published_at, author_id")
    .order("updated_at", { ascending: false });
  if (user.role !== "super_admin") query = query.eq("author_id", user.id);

  const { data: posts } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Articoli</h2>
          <p className="text-sm text-muted-foreground">
            {user.role === "super_admin"
              ? "Tutti gli articoli del blog."
              : "I tuoi articoli."}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articoli/nuovo">
            <Plus />
            Nuovo
          </Link>
        </Button>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nessun articolo. Inizia scrivendone uno.
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      post.status === "published"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                  >
                    {post.status === "published" ? "Pubblicato" : "Bozza"}
                  </span>
                  {" · "}
                  {formatDate(post.published_at ?? post.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href={`/dashboard/articoli/${post.id}`}
                  title="Modifica"
                  className="flex size-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4"
                >
                  <Pencil />
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
