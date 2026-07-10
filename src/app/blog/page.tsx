import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, PenLine } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getPublishedPosts, formatDate } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Resoconti, novità e approfondimenti da Vivere Ingegneria: CICS, Consigli di Dipartimento e vita associativa.",
};

// Revalidate the list periodically so new posts appear without a redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 sm:pt-40">
      <PageHeader
        eyebrow="Blog"
        title="Cosa succede in Ingegneria"
        description="Resoconti dei Consigli, aggiornamenti sulla rappresentanza e racconti delle nostre attività."
      />

      {posts.length === 0 ? (
        <div className="mx-auto mt-14 max-w-md rounded-xl border border-dashed border-border p-10 text-center">
          <PenLine className="mx-auto size-8 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Nessun articolo, per ora</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Il blog riparte da zero. I primi articoli arriveranno presto,
            scritti dalla redazione di Vivere Ingegneria.
          </p>
        </div>
      ) : (
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary"
              >
                {post.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_url}
                    alt=""
                    className="aspect-[16/9] w-full object-cover"
                  />
                ) : (
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-brand-800 to-brand-600" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold leading-snug group-hover:text-primary">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    <span>{formatDate(post.published_at)}</span>
                    {post.author_name && <span>· {post.author_name}</span>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
