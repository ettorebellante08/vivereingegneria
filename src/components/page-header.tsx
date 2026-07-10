import { cn } from "@/lib/utils";

/** Consistent page heading block used across the public static pages. */
export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="text-balance text-4xl font-bold sm:text-5xl">{title}</h1>
      {description && (
        <p className="mt-5 text-balance text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
