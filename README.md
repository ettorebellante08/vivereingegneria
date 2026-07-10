# Vivere Ingegneria — sito web

Nuovo sito dell'associazione studentesca **Vivere Ingegneria nell'Ateneo**
(Corsi di Laurea in Ingegneria, UniPa). Sostituisce il vecchio sito WordPress
con un'applicazione moderna, veloce, responsive e mobile‑first.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** + componenti custom in stile shadcn/ui
- **Supabase** — Postgres + Auth + Storage + **Row Level Security**
- **Tiptap** — editor rich text del blog
- Deploy su **Vercel**

Tema chiaro/scuro, palette derivata dal logo (blu brand `#071D99`), tipografia
Space Grotesk (display) + Inter (testo).

## Ruoli (4 livelli)

| Ruolo | Può |
| --- | --- |
| **Utente standard** | Consultare il sito pubblico (nessun login) |
| **Blogger** | Scrivere/modificare/eliminare i **propri** articoli |
| **Amministratore WEB** | Blogger + modificare pagine statiche e impostazioni |
| **Amministratore supremo** | Tutto + gestione utenti/ruoli e database |

I permessi sono applicati **a livello di database** con RLS (non solo nella UI).
Registrazione limitata alle email `@community.unipa.it` (con un'unica eccezione
documentata), imposta lato client **e** server via trigger.

## Struttura

```
src/
  app/                 route pubbliche + /dashboard (area riservata)
  components/          UI, header/footer, editor, form dashboard
  content/pages.ts     contenuti di default delle pagine statiche (fallback + seed)
  lib/
    supabase/          client browser/server/admin + proxy sessione
    data/              accesso dati con fallback (pagine, corsi, post, settings)
    actions/           server actions (auth, posts, admin)
    auth.ts / roles.ts guardie per ruolo
    validation.ts      regola email istituzionale + password (Zod)
supabase/
  migrations/          0001 schema · 0002 RLS/funzioni · 0003 storage
  seed.sql             corsi, pagine, impostazioni, eccezione email
scripts/seed-users.mjs crea i 3 account iniziali (password casuali, mostrate 1 volta)
```

## Sviluppo

```bash
npm install
cp .env.example .env.local   # compila con le chiavi Supabase
npm run dev
```

Il sito **funziona anche senza Supabase collegato**: le pagine pubbliche usano i
contenuti di default e l'area riservata mostra un avviso. Collega Supabase per
attivare login, blog e pannello admin.

## Deploy

Guida completa passo‑passo (Supabase + Vercel + env + seed + migrazione dominio)
in **[DEPLOY.md](DEPLOY.md)**.
