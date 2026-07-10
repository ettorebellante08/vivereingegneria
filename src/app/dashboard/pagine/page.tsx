import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { STATIC_PAGES } from "@/content/pages";

export default async function PagesListPage() {
  await requireRole("web_admin");
  const pages = Object.values(STATIC_PAGES);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pagine statiche</h2>
        <p className="text-sm text-muted-foreground">
          Modifica i contenuti delle pagine istituzionali del sito.
        </p>
      </div>

      <ul className="divide-y divide-border rounded-xl border border-border">
        {pages.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/dashboard/pagine/${p.slug}`}
              className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-accent"
            >
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">/{p.slug}</p>
              </div>
              <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
