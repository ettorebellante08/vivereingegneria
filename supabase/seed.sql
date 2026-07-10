-- =====================================================================
-- Vivere Ingegneria — seed data (idempotent)
-- Loaded after migrations. Does NOT create user accounts — those are
-- created by scripts/seed-users.mjs (needs the service role + generates
-- random passwords). See that script.
-- =====================================================================

-- ---------- Email exception for the supreme admin -------------------
-- The ONLY allowed exception to the @community.unipa.it rule.
insert into public.email_domain_exceptions (email, reason) values
  ('vivereingegneria@gmail.com',
   'Account Amministratore supremo — eccezione documentata al vincolo @community.unipa.it')
on conflict (email) do nothing;

-- ---------- Courses (the 14 Engineering degrees) --------------------
insert into public.courses (slug, name, sort_order) values
  ('ambientale',                    'Ingegneria Ambientale',                                  10),
  ('biomedica',                     'Ingegneria Biomedica',                                   20),
  ('chimica',                       'Ingegneria Chimica',                                     30),
  ('cibernetica',                   'Ingegneria Cibernetica',                                 40),
  ('civile',                        'Ingegneria Civile',                                      50),
  ('edile',                         'Ingegneria Edile',                                       60),
  ('elettrica',                     'Ingegneria Elettrica',                                   70),
  ('elettronica',                   'Ingegneria Elettronica',                                 80),
  ('energetica',                    'Ingegneria dell''Energia',                               90),
  ('gestionale',                    'Ingegneria Gestionale',                                 100),
  ('informatica',                   'Ingegneria Informatica',                                110),
  ('innovazione-imprese-digitali',  'Ingegneria dell''Innovazione per le Imprese Digitali',  120),
  ('meccanica',                     'Ingegneria Meccanica',                                  130),
  ('sicurezza',                     'Ingegneria della Sicurezza',                            140)
on conflict (slug) do nothing;

-- ---------- Static pages (title-only rows) --------------------------
-- content_html left NULL on purpose: the public site keeps rendering the
-- bundled defaults + a visible "da completare" note until a web_admin
-- writes the real copy. The admin editor prefills the bundled scaffold
-- when a row is empty.
insert into public.static_pages (slug, title) values
  ('chi-siamo',       'Chi siamo'),
  ('rappresentanza',  'Rappresentanza'),
  ('attivita',        'Attività'),
  ('bandi',           'Bandi'),
  ('futuri-studenti', 'Futuri studenti'),
  ('link-utili',      'Link utili'),
  ('organigramma',    'Organigramma')
on conflict (slug) do nothing;

-- ---------- Site settings (editable defaults) -----------------------
insert into public.site_settings (key, value) values
  ('contact_email', '"vivereingegneria@gmail.com"'::jsonb),
  ('social', '{
    "facebook":  "https://www.facebook.com/vivereingegneria",
    "instagram": "https://www.instagram.com/vivereingegneria",
    "linkedin":  "https://www.linkedin.com/company/vivere-ingegneria",
    "telegram":  "https://t.me/vivereingegneria"
  }'::jsonb)
on conflict (key) do nothing;
