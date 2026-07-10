-- =====================================================================
-- Vivere Ingegneria — storage
-- Public "media" bucket for blog cover images / inline images and page
-- assets. Public read; only blogger+ may upload, only the uploader or a
-- web_admin may modify/delete.
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public can read objects in the media bucket.
create policy "media bucket: public read"
  on storage.objects for select
  using (bucket_id = 'media');

-- blogger+ can upload.
create policy "media bucket: blogger uploads"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_blogger());

-- Uploader (owner) or web_admin can update objects.
create policy "media bucket: owner or web_admin updates"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'media'
    and (owner = auth.uid() or public.is_web_admin())
  );

-- Uploader (owner) or web_admin can delete objects.
create policy "media bucket: owner or web_admin deletes"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'media'
    and (owner = auth.uid() or public.is_web_admin())
  );
