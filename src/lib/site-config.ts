/**
 * Central information architecture for the site.
 *
 * These are the DEFAULT / fallback values. Contacts, social links and the
 * navigation can later be overridden from the `site_settings` table by a
 * web_admin. Nothing here hardcodes the production domain — canonical URLs are
 * derived from NEXT_PUBLIC_SITE_URL (see lib/site-url.ts).
 */

export const SITE = {
  name: "Vivere Ingegneria",
  fullName: "Vivere Ingegneria nell'Ateneo",
  tagline: "L'associazione studentesca dei corsi di Ingegneria",
  description:
    "Vivere Ingegneria è l'associazione studentesca che dal 2008 opera nei Corsi di Laurea in Ingegneria: rappresentanza, eventi, seminari e comunicazione per gli studenti.",
  foundedYear: 2008,
} as const;

export const CONTACT = {
  email: "vivereingegneria@gmail.com",
  social: {
    facebook: "https://www.facebook.com/vivereingegneria",
    instagram: "https://www.instagram.com/vivereingegneria",
    linkedin: "https://www.linkedin.com/company/vivere-ingegneria",
    telegram: "https://t.me/vivereingegneria",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

/** Primary navigation, mirrors (and modernises) the existing site's IA. */
export const NAV: NavItem[] = [
  {
    label: "Chi siamo",
    href: "/chi-siamo",
    children: [
      { label: "Cos'è Vivere Ingegneria", href: "/chi-siamo#cos-e" },
      { label: "Cosa facciamo", href: "/chi-siamo#cosa-facciamo" },
      { label: "I nostri spazi", href: "/chi-siamo#spazi" },
      { label: "Organigramma", href: "/organigramma" },
      { label: "Storia", href: "/chi-siamo#storia" },
    ],
  },
  {
    label: "Rappresentanza",
    href: "/rappresentanza",
  },
  {
    label: "Attività",
    href: "/attivita",
  },
  {
    label: "Il mio corso",
    href: "/corsi",
  },
  {
    label: "Bandi",
    href: "/bandi",
  },
  {
    label: "Futuri studenti",
    href: "/futuri-studenti",
  },
  {
    label: "Link utili",
    href: "/link-utili",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

/**
 * The 14 Engineering degree courses (Corsi di Laurea) at UniPa.
 * Derived from the current site's "Il mio corso" menu. Confirm/adjust names
 * as needed — these seed the `courses` table.
 */
export const COURSES: { slug: string; name: string }[] = [
  { slug: "ambientale", name: "Ingegneria Ambientale" },
  { slug: "biomedica", name: "Ingegneria Biomedica" },
  { slug: "chimica", name: "Ingegneria Chimica" },
  { slug: "cibernetica", name: "Ingegneria Cibernetica" },
  { slug: "civile", name: "Ingegneria Civile" },
  { slug: "edile", name: "Ingegneria Edile" },
  { slug: "elettrica", name: "Ingegneria Elettrica" },
  { slug: "elettronica", name: "Ingegneria Elettronica" },
  { slug: "energetica", name: "Ingegneria dell'Energia" },
  { slug: "gestionale", name: "Ingegneria Gestionale" },
  { slug: "informatica", name: "Ingegneria Informatica" },
  {
    slug: "innovazione-imprese-digitali",
    name: "Ingegneria dell'Innovazione per le Imprese Digitali",
  },
  { slug: "meccanica", name: "Ingegneria Meccanica" },
  { slug: "sicurezza", name: "Ingegneria della Sicurezza" },
];
