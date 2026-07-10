-- =====================================================================
-- Vivere Ingegneria — functions, triggers & Row Level Security
-- Principle: default-deny. Every table has RLS enabled; access is granted
-- explicitly per role. Role checks go through SECURITY DEFINER helpers to
-- avoid recursive policy evaluation on `profiles`.
-- =====================================================================

-- ---------- Role helpers --------------------------------------------
-- Reads the caller's role. SECURITY DEFINER so it bypasses `profiles`
-- RLS (prevents infinite recursion in profiles policies). search_path is
-- pinned to avoid hijacking.
create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_super()
returns boolean language sql stable
set search_path = public as $$
  select public.current_app_role() = 'super_admin';
$$;

-- web_admin inherits everything web_admin+super can do.
create or replace function public.is_web_admin()
returns boolean language sql stable
set search_path = public as $$
  select public.current_app_role() in ('web_admin', 'super_admin');
$$;

-- blogger inherits up to super_admin (all can author posts).
create or replace function public.is_blogger()
returns boolean language sql stable
set search_path = public as $$
  select public.current_app_role() in ('blogger', 'web_admin', 'super_admin');
$$;

-- Does the caller own the given post? SECURITY DEFINER to avoid recursion
-- through the posts SELECT policy.
create or replace function public.owns_post(pid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.posts where id = pid and author_id = auth.uid()
  );
$$;

-- ---------- New-user handling & email rule --------------------------
-- Enforce institutional email domain, with an explicit exception list.
-- Runs for EVERY auth.users insert (self-signup is disabled, but this also
-- guards admin-created accounts). The supreme admin's gmail is the only
-- seeded exception.
create or replace function public.enforce_email_domain()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) like '%@community.unipa.it'
     or exists (
       select 1 from public.email_domain_exceptions e
       where e.email = lower(new.email)
     )
  then
    return new;
  end if;

  raise exception
    'Registrazione consentita solo con email @community.unipa.it (eccezioni esplicite escluse).';
end;
$$;

create trigger enforce_email_domain_before_insert
  before insert on auth.users
  for each row execute function public.enforce_email_domain();

-- Create the matching profile row. Role and the change-password flag may be
-- supplied via user metadata at creation time (used by the seed script);
-- otherwise defaults to the least-privileged 'member'.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_role public.app_role;
begin
  begin
    meta_role := (new.raw_user_meta_data ->> 'initial_role')::public.app_role;
  exception when others then
    meta_role := 'member';
  end;

  insert into public.profiles (id, full_name, role, must_change_password)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(meta_role, 'member'),
    coalesce((new.raw_user_meta_data ->> 'must_change_password')::boolean, false)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Lets a user clear their own must_change_password flag after a successful
-- password change, WITHOUT being able to touch their role. SECURITY DEFINER,
-- scoped strictly to the caller's own row.
create or replace function public.complete_password_change()
returns void
language sql
security definer
set search_path = public
as $$
  update public.profiles
  set must_change_password = false
  where id = auth.uid();
$$;

-- ---------- Public authors view -------------------------------------
-- Exposes ONLY id + display fields so the public blog can show author
-- names without opening up the profiles table (roles/flags stay private).
-- Definer-rights view (security_invoker off) intentionally bypasses
-- profiles RLS for these columns only.
create view public.authors as
  select id, full_name, avatar_url from public.profiles;

grant select on public.authors to anon, authenticated;

-- =====================================================================
-- Enable RLS
-- =====================================================================
alter table public.profiles                enable row level security;
alter table public.posts                   enable row level security;
alter table public.categories              enable row level security;
alter table public.post_categories         enable row level security;
alter table public.static_pages            enable row level security;
alter table public.site_settings           enable row level security;
alter table public.courses                 enable row level security;
alter table public.media                   enable row level security;
alter table public.email_domain_exceptions enable row level security;

-- =====================================================================
-- profiles
-- =====================================================================
create policy "profiles: read own or super"
  on public.profiles for select
  using (id = auth.uid() or public.is_super());

-- Users may edit their own display fields but NOT their role. The role must
-- stay equal to its current value (checked via the SECURITY DEFINER helper
-- to avoid recursion).
create policy "profiles: update own (not role)"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid() and role = public.current_app_role());

-- Supreme admin manages all profiles (role assignment, user management).
create policy "profiles: super manage all"
  on public.profiles for all
  using (public.is_super())
  with check (public.is_super());

-- (No client INSERT policy: profiles are created by the auth trigger, and
--  the super_admin creates users through the service role which bypasses RLS.)

-- =====================================================================
-- posts
-- =====================================================================
create policy "posts: public reads published"
  on public.posts for select
  using (
    status = 'published'
    or author_id = auth.uid()
    or public.is_super()
  );

create policy "posts: blogger inserts own"
  on public.posts for insert
  with check (public.is_blogger() and author_id = auth.uid());

create policy "posts: author updates own"
  on public.posts for update
  using ((author_id = auth.uid() and public.is_blogger()) or public.is_super())
  with check ((author_id = auth.uid() and public.is_blogger()) or public.is_super());

create policy "posts: author deletes own"
  on public.posts for delete
  using ((author_id = auth.uid() and public.is_blogger()) or public.is_super());

-- =====================================================================
-- categories  (public taxonomy)
-- =====================================================================
create policy "categories: public read"
  on public.categories for select using (true);

create policy "categories: blogger creates"
  on public.categories for insert with check (public.is_blogger());

create policy "categories: web_admin updates"
  on public.categories for update
  using (public.is_web_admin()) with check (public.is_web_admin());

create policy "categories: web_admin deletes"
  on public.categories for delete using (public.is_web_admin());

-- =====================================================================
-- post_categories  (tagging a post you own)
-- =====================================================================
create policy "post_categories: public read"
  on public.post_categories for select using (true);

create policy "post_categories: owner tags"
  on public.post_categories for insert
  with check (public.owns_post(post_id) or public.is_super());

create policy "post_categories: owner untags"
  on public.post_categories for delete
  using (public.owns_post(post_id) or public.is_super());

-- =====================================================================
-- static_pages  (web_admin CMS)
-- =====================================================================
create policy "static_pages: public read"
  on public.static_pages for select using (true);

create policy "static_pages: web_admin writes"
  on public.static_pages for all
  using (public.is_web_admin()) with check (public.is_web_admin());

-- =====================================================================
-- site_settings  (web_admin config)
-- =====================================================================
create policy "site_settings: public read"
  on public.site_settings for select using (true);

create policy "site_settings: web_admin writes"
  on public.site_settings for all
  using (public.is_web_admin()) with check (public.is_web_admin());

-- =====================================================================
-- courses  (web_admin managed, public read)
-- =====================================================================
create policy "courses: public read"
  on public.courses for select using (true);

create policy "courses: web_admin writes"
  on public.courses for all
  using (public.is_web_admin()) with check (public.is_web_admin());

-- =====================================================================
-- media
-- =====================================================================
create policy "media: public read"
  on public.media for select using (true);

create policy "media: blogger inserts own"
  on public.media for insert
  with check (public.is_blogger() and uploaded_by = auth.uid());

create policy "media: owner or web_admin deletes"
  on public.media for delete
  using (uploaded_by = auth.uid() or public.is_web_admin());

-- =====================================================================
-- email_domain_exceptions  (super_admin only; never public)
-- =====================================================================
create policy "email_exceptions: super manages"
  on public.email_domain_exceptions for all
  using (public.is_super()) with check (public.is_super());
