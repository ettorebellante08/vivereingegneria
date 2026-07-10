"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Settings, Users, KeyRound } from "lucide-react";
import type { AppRole } from "@/lib/database.types";
import { roleAtLeast } from "@/lib/roles";
import { cn } from "@/lib/utils";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  min: AppRole;
};

const ITEMS: Item[] = [
  { label: "Panoramica", href: "/dashboard", icon: LayoutDashboard, min: "member" },
  { label: "Articoli", href: "/dashboard/articoli", icon: FileText, min: "blogger" },
  { label: "Pagine", href: "/dashboard/pagine", icon: FileText, min: "web_admin" },
  { label: "Impostazioni", href: "/dashboard/impostazioni", icon: Settings, min: "web_admin" },
  { label: "Utenti", href: "/dashboard/utenti", icon: Users, min: "super_admin" },
  { label: "Password", href: "/dashboard/cambia-password", icon: KeyRound, min: "member" },
];

export function DashboardNav({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => roleAtLeast(role, i.min));

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {items.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
