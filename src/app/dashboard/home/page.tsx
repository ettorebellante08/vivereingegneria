import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getPageDraft } from "@/lib/data/pages";
import { HOME_SLUG } from "@/lib/blocks/paths";
import { VisualEditor } from "@/components/dashboard/visual-editor/visual-editor";

export default async function EditHomePage() {
  await requireRole("web_admin");
  const draft = await getPageDraft(HOME_SLUG);

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
        <h2 className="text-xl font-semibold">Modifica: Home</h2>
        <p className="text-sm text-muted-foreground">
          I blocchi qui sotto compaiono nella home, tra la galleria e il blog.
          L&apos;intestazione con il logo e le sezioni automatiche restano fisse.
        </p>
      </div>
      <VisualEditor
        slug={HOME_SLUG}
        publicPath="/"
        initialTitle={draft.title ?? "Home"}
        initialBlocks={draft.blocks}
        titleLabel="Titolo (uso interno)"
      />
    </div>
  );
}
