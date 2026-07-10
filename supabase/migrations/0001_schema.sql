-- =====================================================================
-- Vivere Ingegneria — schema
-- Tables, enums, indexes and updated_at triggers.
-- RLS policies live in 0002_rls.sql; storage in 0003_storage.sql.
-- =====================================================================

-- ---------- Enums ----------------------------------------------------
-- Roles. `member` is the base level for an authenticated user with NO
-- elevated powers (a "standard user" who happens to be logged in). The
-- three privileged roles from the brief build on top of it.
create type public.app_role as enum (
  'member',
  'blogger',
  'web_admin',
  'super_admin'
);

create type public.post_status as enum ('draft', 'published');

-- ---------- updated_at helper ---------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles -------------------------------------------------
-- One row per auth user. Created automatically by a trigger on
-- auth.users (see 0002). `role` is only ever changed by a super_admin.
create table public.profiles (
  id                    uuid primary key references auth.users (id) on delete cascade,
  full_name             text,
  avatar_url            text,
  role                  public.app_role not null default 'member',
  must_change_password  boolean not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- courses --------------------------------------------------
create table public.courses (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  description  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ---------- categories ----------------------------------------------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  created_at  timestamptz not null default now()
);

-- ---------- posts ----------------------------------------------------
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references public.profiles (id) on delete cascade,
  title         text not null,
  slug          text not null unique,
  excerpt       text,
  content_json  jsonb,          -- Tiptap document (source of truth for editing)
  content_html  text,           -- sanitised HTML rendered on the public site
  cover_url     text,
  status        public.post_status not null default 'draft',
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index posts_status_published_at_idx
  on public.posts (status, published_at desc);
create index posts_author_idx on public.posts (author_id);

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------- post_categories (join) ----------------------------------
create table public.post_categories (
  post_id      uuid not null references public.posts (id) on delete cascade,
  category_id  uuid not null references public.categories (id) on delete cascade,
  primary key (post_id, category_id)
);

-- ---------- static_pages --------------------------------------------
-- CMS-editable institutional pages (Chi siamo, Bandi, ...). Editable by
-- web_admin+. The public site falls back to bundled defaults when a row
-- is absent.
create table public.static_pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  content_json  jsonb,
  content_html  text,
  updated_by    uuid references public.profiles (id) on delete set null,
  updated_at    timestamptz not null default now()
);

create trigger static_pages_set_updated_at
  before update on public.static_pages
  for each row execute function public.set_updated_at();

-- ---------- site_settings -------------------------------------------
-- Key/value config editable by web_admin+ (menu, contacts, social...).
create table public.site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_by  uuid references public.profiles (id) on delete set null,
  updated_at  timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------- media ----------------------------------------------------
-- Bookkeeping for files uploaded to the storage bucket.
create table public.media (
  id           uuid primary key default gen_random_uuid(),
  path         text not null unique,
  uploaded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ---------- email domain exceptions ---------------------------------
-- Explicit allow-list of emails permitted to bypass the
-- @community.unipa.it registration rule. Seeded with ONLY the supreme
-- admin address — this is a documented exception, not a generic bypass.
create table public.email_domain_exceptions (
  email       text primary key,
  reason      text,
  created_at  timestamptz not null default now()
);
