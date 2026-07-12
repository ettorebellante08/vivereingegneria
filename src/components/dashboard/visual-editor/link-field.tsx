"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { STATIC_PAGES } from "@/content/pages";
import { COURSES } from "@/lib/site-config";

type Group = { label: string; options: { value: string; label: string }[] };

/** Internal link targets, so admins link pages together without typing URLs. */
function useLinkGroups(): Group[] {
  return useMemo(
    () => [
      {
        label: "Principali",
        options: [
          { value: "/", label: "Home" },
          { value: "/blog", label: "Blog" },
          { value: "/corsi", label: "Tutti i corsi" },
          { value: "/contatti", label: "Contatti" },
        ],
      },
      {
        label: "Pagine",
        options: Object.values(STATIC_PAGES).map((p) => ({
          value: `/${p.slug}`,
          label: p.title,
        })),
      },
      {
        label: "Corsi di laurea",
        options: COURSES.map((c) => ({ value: `/corsi/${c.slug}`, label: c.name })),
      },
    ],
    [],
  );
}

/**
 * Link picker: choose an internal page from the dropdown, or type any URL.
 * The two stay in sync — selecting a page fills the field, editing the field
 * flips the dropdown to "Personalizzato".
 */
export function LinkField({
  value,
  onChange,
  placeholder = "/contatti oppure https://…",
}: {
  value: string;
  onChange: (href: string) => void;
  placeholder?: string;
}) {
  const groups = useLinkGroups();
  const known = groups.some((g) => g.options.some((o) => o.value === value));

  return (
    <div className="space-y-2">
      <select
        value={known ? value : "__custom__"}
        onChange={(e) => {
          if (e.target.value !== "__custom__") onChange(e.target.value);
        }}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      >
        {groups.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value="__custom__">Link personalizzato…</option>
      </select>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
