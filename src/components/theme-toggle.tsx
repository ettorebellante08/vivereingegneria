"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // Icons are toggled purely via CSS `dark:` variants, so there is no
  // theme-dependent state in render (no hydration mismatch, no effect).
  // resolvedTheme is only read inside the click handler.
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Cambia tema"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="block dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
