import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getCourse } from "@/lib/data/courses";
import { getPageDraft } from "@/lib/data/pages";
import { courseStorageSlug } from "@/lib/blocks/paths";
import { VisualEditor } from "@/components/dashboard/visual-editor/visual-editor";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireRole("web_admin");
  const { slug } = await params;

  const course = await getCourse(slug);
  if (!course) notFound();

  const storageSlug = courseStorageSlug(slug);
  const draft = await getPageDraft(storageSlug);

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/pagine"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Pagine
      </Link>
      <div>
        <h2 className="text-xl font-semibold">Modifica corso: {course.name}</h2>
        <p className="text-sm text-muted-foreground">
          Pubblica su{" "}
          <Link href={`/corsi/${slug}`} className="text-primary hover:underline">
            /corsi/{slug}
          </Link>
        </p>
      </div>
      <VisualEditor
        slug={storageSlug}
        publicPath={`/corsi/${slug}`}
        initialTitle={draft.title ?? course.name}
        initialBlocks={draft.blocks}
        titleLabel="Titolo (uso interno)"
      />
    </div>
  );
}
