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
      {eyebrow && <p className="eyebrow mb-5 text-primary">{eyebrow}</p>}
      <h1 className="text-balance text-5xl leading-[1.05] sm:text-7xl">{title}</h1>
      {description && (
        <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
