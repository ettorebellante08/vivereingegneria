import { TriangleAlert } from "lucide-react";

/**
 * Explicit, highly-visible marker for content that could NOT be recovered
 * from the legacy site and must be supplied by the association — per the
 * project brief, we flag rather than invent institutional content.
 */
export function PlaceholderNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-6 flex gap-3 rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-4 text-sm">
      <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="space-y-1">
        <p className="font-semibold text-amber-700 dark:text-amber-300">
          Contenuto da completare
        </p>
        <div className="text-amber-900/80 dark:text-amber-100/80">{children}</div>
      </div>
    </div>
  );
}
