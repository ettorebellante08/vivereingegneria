# Guida al deploy — Vivere Ingegneria

Guida passo‑passo per collegare il progetto ai **tuoi** account Supabase e
Vercel già esistenti, popolare il database e andare online su un dominio
`*.vercel.app`. Alla fine trovi la procedura per migrare a
`vivereingegneria.com`.

> Nessun URL di produzione è hardcodato nel codice: la migrazione del dominio
> sarà un cambio di configurazione, non di codice.

---

## 0. Prerequisiti

- Node.js 20+ (il progetto è testato su Node 24)
- Account **Supabase** e **Vercel** (li hai già)
- `git` e un repository (consigliato: crea un repo su GitHub e fai push)

```bash
# dalla cartella del progetto
npm install
cp .env.example .env.local   # lo compileremo tra poco
```

---

## 1. Supabase — crea e collega il progetto

### 1.1 Crea il progetto

Dal [dashboard Supabase](https://supabase.com/dashboard) → **New project**.
Scegli nome, password del database (salvala) e regione (es. *Frankfurt*).

### 1.2 Recupera le chiavi

Project → **Settings → API**:

| Valore | Variabile d'ambiente |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key (segreta!) | `SUPABASE_SERVICE_ROLE_KEY` |

Incolla i primi tre in `.env.local`. **La `service_role` non va mai esposta al
browser né committata.**

### 1.3 Collega la CLI e applica lo schema

```bash
# login (apre il browser)
npx supabase login

# collega la cartella al tuo progetto remoto
#   il PROJECT-REF è nell'URL del dashboard: app.supabase.com/project/<REF>
npx supabase link --project-ref <PROJECT-REF>

# applica le migrazioni (tabelle, ruoli, RLS, storage)
npx supabase db push
```

### 1.4 Carica i dati iniziali (seed)

Il seed (14 corsi, righe delle pagine statiche, eccezione email del super
admin, impostazioni) va eseguito una volta. Usa la connection string
(**Settings → Database → Connection string → URI**, modalità *psql*):

```bash
psql "postgresql://postgres:[PASSWORD]@db.<PROJECT-REF>.supabase.co:5432/postgres" \
  -f supabase/seed.sql
```

> In alternativa: copia il contenuto di `supabase/seed.sql` nell'**SQL Editor**
> del dashboard ed eseguilo.

### 1.5 Crea i 3 account iniziali

Questo script crea gli account con **password casuali sicure e diverse**, forza
il cambio password al primo login e assegna i ruoli. Le password vengono
**stampate una sola volta a terminale** e non sono salvate da nessuna parte.

```bash
node --env-file=.env.local scripts/seed-users.mjs
```

Account creati:

| Ruolo | Email |
| --- | --- |
| Blogger | `giovanni.barra@community.unipa.it` |
| Amministratore WEB | `andrea.depasquale@community.unipa.it` |
| Amministratore supremo | `vivereingegneria@gmail.com` (eccezione documentata al vincolo `@community.unipa.it`) |

Copia le password e inviale ai destinatari su un canale sicuro.

### 1.6 Blinda l'autenticazione

Dashboard → **Authentication → Sign In / Providers**:

- **Disabilita** «Allow new users to sign up» (la registrazione self‑service non
  è prevista: gli account li crea l'amministratore supremo).
- Lascia attivo **Email** provider.

Dashboard → **Authentication → URL Configuration**:

- **Site URL**: l'URL Vercel (lo avrai dopo lo step 2), es.
  `https://vivere-ingegneria.vercel.app`
- Aggiungilo anche tra i **Redirect URLs**.

> Il vincolo email `@community.unipa.it` è comunque applicato **lato database**
> da un trigger (`enforce_email_domain`), con l'unica eccezione whitelisted del
> gmail del super admin: è difesa in profondità, non si basa sul client.

---

## 2. Vercel — deploy

### 2.1 Collega il progetto

```bash
npx vercel login
npx vercel link      # crea/collega il progetto Vercel a questa cartella
```

### 2.2 Imposta le variabili d'ambiente

```bash
# ambienti: Production, Preview, Development (ripeti per ciascuno se serve)
npx vercel env add NEXT_PUBLIC_SUPABASE_URL
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
npx vercel env add SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_SITE_URL: lascialo NON impostato per ora (fallback automatico)
```

Incolla i valori quando richiesto. In alternativa puoi aggiungerle dalla UI:
Project → **Settings → Environment Variables**.

### 2.3 Deploy

```bash
npx vercel --prod
```

Oppure collega il repo GitHub al progetto Vercel: ogni push su `main` fa deploy
in produzione e ogni PR genera un'anteprima.

Dopo il primo deploy, torna allo **step 1.6** e inserisci l'URL Vercel come Site
URL / Redirect URL in Supabase.

### 2.4 Verifica

- Apri l'URL `*.vercel.app`: il sito pubblico funziona.
- Vai su `/login`, accedi con uno dei 3 account: al primo accesso ti verrà
  chiesto di cambiare la password.
- Come **super admin** apri `/dashboard/utenti`: crei utenti e assegni ruoli.
- Come **web admin** apri `/dashboard/pagine`: modifichi i testi delle pagine.
- Come **blogger** apri `/dashboard/articoli`: scrivi un articolo.

---

## 3. Comandi utili

```bash
npm run dev          # sviluppo locale (http://localhost:3000)
npm run build        # build di produzione
npx supabase db push # applica nuove migrazioni
# rigenera i tipi TS dal DB remoto (dopo modifiche allo schema):
npx supabase gen types typescript --linked > src/lib/database.types.ts
```

---

## 4. Migrazione al dominio `vivereingegneria.com`

Quando vorrai passare dal dominio provvisorio a quello definitivo:

1. **Vercel** → Project → **Settings → Domains** → *Add* `vivereingegneria.com`
   (e `www.vivereingegneria.com`).
2. Configura il **DNS** dal tuo registrar seguendo le istruzioni di Vercel
   (record `A`/`CNAME` per apex e `www`). Vercel emette il certificato HTTPS
   automaticamente.
3. **Env var**: imposta `NEXT_PUBLIC_SITE_URL=https://vivereingegneria.com` in
   Production (`npx vercel env add NEXT_PUBLIC_SITE_URL`) e fai un redeploy.
   Questo aggiorna canonical URL, metadata Open Graph e sitemap.
4. **Supabase** → Authentication → URL Configuration: cambia **Site URL** in
   `https://vivereingegneria.com` e aggiungilo ai **Redirect URLs** (puoi
   lasciare anche l'URL Vercel per le anteprime).
5. (Opzionale) Imposta un redirect 308 da `*.vercel.app` al dominio finale, o
   dal vecchio WordPress al nuovo sito.

Nessuna modifica al codice è necessaria: l'app legge sempre il dominio da
`NEXT_PUBLIC_SITE_URL` (con fallback automatico all'URL Vercel in anteprima).
