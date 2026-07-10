/**
 * Default content for the static pages.
 *
 * Two roles:
 *  1. Fallback rendered when Supabase is not yet linked or `static_pages` has
 *     no row for the slug.
 *  2. Seed source for the `static_pages` table (see supabase/seed.sql notes).
 *
 * `needsContent: true` marks pages whose full body could NOT be recovered from
 * the legacy WordPress site (its content is JS-rendered and returned empty on
 * fetch). Per the brief we DO NOT invent institutional copy — these render a
 * visible "da completare" note. Real snippets that WERE recoverable are kept.
 */

export type StaticPageContent = {
  slug: string;
  title: string;
  description: string;
  /** Trusted HTML body rendered via <Prose>. */
  bodyHtml: string;
  /** When true, the page shows an explicit placeholder note. */
  needsContent: boolean;
  /** Optional guidance describing exactly what copy is missing. */
  missing?: string;
};

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  "chi-siamo": {
    slug: "chi-siamo",
    title: "Chi siamo",
    description:
      "Vivere Ingegneria è l'associazione studentesca che dal 2008 opera nei Corsi di Laurea in Ingegneria dell'Università degli Studi di Palermo.",
    needsContent: true,
    missing:
      "Testo integrale delle sezioni «Cos'è Vivere Ingegneria», «Cosa facciamo», «I nostri spazi» e «Storia» dal vecchio sito.",
    bodyHtml: `
      <h2 id="cos-e">Cos'è Vivere Ingegneria</h2>
      <p>Vivere Ingegneria è l'associazione studentesca che <strong>dal 2008</strong>
      opera nei Corsi di Laurea in Ingegneria, occupandosi di rappresentanza
      studentesca e organizzando iniziative formative, seminari ed eventi per gli
      studenti.</p>
      <blockquote>«Lo facciamo per poter dire: dato che non c'è niente, noi vogliamo
      rimboccarci le maniche e costruire qualche cosa.»</blockquote>
      <h2 id="cosa-facciamo">Cosa facciamo</h2>
      <p>Rappresentanza negli organi accademici, seminari e formazione, eventi e
      momenti di aggregazione, comunicazione e supporto agli studenti dei corsi di
      ingegneria.</p>
      <h2 id="spazi">I nostri spazi</h2>
      <h2 id="storia">Storia</h2>
    `,
  },
  rappresentanza: {
    slug: "rappresentanza",
    title: "Rappresentanza",
    description:
      "Portiamo la voce degli studenti di Ingegneria negli organi che decidono la vita universitaria.",
    needsContent: true,
    missing:
      "Descrizione della rappresentanza e l'elenco aggiornato dei rappresentanti (nome, organo, corso, contatto). Meglio gestirli come dati strutturati.",
    bodyHtml: `
      <p>I rappresentanti degli studenti sono studentesse e studenti eletti che
      siedono negli organi accademici — Consiglio di Corso di Studi (CICS),
      Consiglio di Dipartimento e altri — per portare la voce di chi studia
      Ingegneria e vigilare sulle decisioni che riguardano la didattica e i
      servizi.</p>
    `,
  },
  attivita: {
    slug: "attivita",
    title: "Attività",
    description:
      "Seminari, progetti, gruppi di studio e iniziative pensate per la comunità di Ingegneria.",
    needsContent: true,
    missing:
      "Descrizioni aggiornate delle singole attività (Inspire Magazine, Seminari, Gruppi di Studio, Road to 30 e Lode, Recruitment & Lavoro, Progetto Vivere il Dipartimento, ecc.).",
    bodyHtml: `<p>Le nostre iniziative spaziano dalla formazione all'orientamento al lavoro.</p>`,
  },
  bandi: {
    slug: "bandi",
    title: "Bandi",
    description:
      "Diritto allo studio, mobilità internazionale e passaggi di corso: le opportunità da non perdere.",
    needsContent: true,
    missing:
      "Testo e scadenze aggiornate di ERSU (Diritto allo Studio), Erasmus+ (Mobilità Internazionale) e Passaggio di Corso.",
    bodyHtml: `
      <h2>Diritto allo Studio (ERSU)</h2>
      <p>Borse di studio, posti alloggio e servizi ERSU per gli studenti idonei.</p>
      <h2>Mobilità Internazionale (Erasmus+)</h2>
      <p>Periodi di studio all'estero nell'ambito del programma Erasmus+.</p>
      <h2>Passaggio di Corso</h2>
      <p>Procedure e scadenze per il passaggio ad altro corso di laurea.</p>
    `,
  },
  "futuri-studenti": {
    slug: "futuri-studenti",
    title: "Futuri studenti",
    description:
      "Stai per scegliere Ingegneria? Qui trovi orientamento e risposte alle domande più comuni.",
    needsContent: true,
    missing:
      "Contenuti di orientamento per le matricole (come funziona il TOLC/test d'ingresso, scelta del corso, primo anno, consigli).",
    bodyHtml: `<p>Informazioni utili per orientarsi nella scelta del corso e affrontare il primo anno.</p>`,
  },
  "link-utili": {
    slug: "link-utili",
    title: "Link utili",
    description: "Le risorse che usiamo ogni giorno, raccolte in un unico posto.",
    needsContent: true,
    missing:
      "Elenco aggiornato dei link (Portale Studenti, orari, mappe aule, biblioteche, gruppi Facebook/Telegram per corso, FAQ, appunti).",
    bodyHtml: `<p>Raccolta di collegamenti a portali, orari, mappe e community studentesche.</p>`,
  },
  organigramma: {
    slug: "organigramma",
    title: "Organigramma",
    description: "Le persone che tengono viva l'associazione.",
    needsContent: true,
    missing:
      "Composizione aggiornata del direttivo e dei team (nome, ruolo, eventuale foto). Da gestire idealmente come dati strutturati.",
    bodyHtml: `<p>Il team che coordina le attività di Vivere Ingegneria.</p>`,
  },
};
