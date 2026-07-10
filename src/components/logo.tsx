import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Brand logo. The source SVGs are monochrome brand-blue (#071D99); in dark
 * mode we render them white via `brightness-0 invert` so they stay legible on
 * dark surfaces without shipping a second asset.
 */
export function Logo({
  variant = "full",
  className,
  withLink = true,
}: {
  variant?: "full" | "mark";
  className?: string;
  withLink?: boolean;
}) {
  const src = variant === "full" ? "/brand/logo-full.svg" : "/brand/logo-mark.svg";
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Vivere Ingegneria"
      className={cn(
        "h-9 w-auto select-none dark:brightness-0 dark:invert",
        className,
      )}
      draggable={false}
    />
  );

  if (!withLink) return img;

  return (
    <Link href="/" aria-label="Vivere Ingegneria — home" className="inline-flex">
      {img}
    </Link>
  );
}
