"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = () => setOpen(false);

  const isHome = pathname === "/";
  // Transparent, light-on-dark treatment only while sitting over the home hero.
  const overlay = isHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overlay
          ? "bg-transparent"
          : "border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Logo className={cn("h-8", overlay && "brightness-0 invert")} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                overlay
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
                !overlay && isActive(item.href) && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className={cn(overlay && "text-white")}>
            <ThemeToggle />
          </div>
          <Link
            href="/login"
            className={cn(
              "hidden rounded-full px-4 py-2 text-sm font-medium transition-colors sm:inline-flex",
              overlay
                ? "border border-white/25 text-white hover:bg-white/10"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            Area riservata
          </Link>
          <button
            type="button"
            className={cn(
              "flex size-10 items-center justify-center rounded-full lg:hidden",
              overlay ? "text-white" : "text-foreground",
            )}
            aria-label="Apri il menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border bg-background lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-base transition-colors hover:bg-accent",
                    isActive(item.href)
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block rounded-full bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground"
              >
                Area riservata
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
