"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV, type NavItem } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  const closeMenu = () => setOpen(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || open
          ? "border-b border-border/70 bg-background/85 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-background/0",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between gap-4 transition-[height] duration-300",
          scrolled ? "h-14" : "h-20",
        )}
      >
        <Logo className={cn("shrink-0 transition-[height] duration-300", scrolled ? "h-7" : "h-8")} />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <DesktopNavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              reduce={!!reduce}
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full border border-foreground/15 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
          >
            Area riservata
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-foreground lg:hidden"
            aria-label={open ? "Chiudi il menu" : "Apri il menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            key="mobile-nav"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
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
                  {item.children && (
                    <ul className="ml-3 border-l border-border pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeMenu}
                            className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
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
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/** A single desktop nav entry with an animated active underline and an
 *  optional hover/focus dropdown for its children. */
function DesktopNavItem({
  item,
  active,
  reduce,
}: {
  item: NavItem;
  active: boolean;
  reduce: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={item.href}
        aria-haspopup={hasChildren || undefined}
        aria-expanded={hasChildren ? hovered : undefined}
        onFocus={() => setHovered(true)}
        className={cn(
          "relative flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {item.label}
        {hasChildren && (
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              hovered && "rotate-180",
            )}
          />
        )}
        {active && (
          <motion.span
            layoutId={reduce ? undefined : "nav-active"}
            className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>

      {hasChildren && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-full min-w-60 pt-3"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-lg">
                {item.children!.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="block rounded-lg px-3 py-2 transition-colors hover:bg-accent"
                  >
                    <span className="block text-sm text-foreground">{child.label}</span>
                    {child.description && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {child.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
