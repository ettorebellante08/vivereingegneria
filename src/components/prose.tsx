import { cn } from "@/lib/utils";

/**
 * Renders trusted rich-text HTML (authored via the admin editor, or the
 * bundled defaults) with brand-tuned typography.
 *
 * The HTML is trusted: it originates only from authenticated admins/bloggers
 * and is sanitised at write time. Do not feed arbitrary user input here.
 */
export function Prose({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-neutral dark:prose-invert max-w-none",
        "prose-headings:font-display prose-headings:tracking-tight",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-strong:text-foreground",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
