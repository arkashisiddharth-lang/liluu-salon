-- =====================================================================
-- Supabase Storage bucket + policies for service images.
-- Safe to re-run: uses ON CONFLICT / IF NOT EXISTS guards throughout.
-- =====================================================================

-- Create a public bucket for service images (public so homepage <img> tags
-- can load them directly without signed URLs).
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

-- Anyone can view images in this bucket (they're public marketing photos).
drop policy if exists "public_read_service_images" on storage.objects;
create policy "public_read_service_images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'service-images');

-- Only logged-in admins can upload/replace/delete images in this bucket.
drop policy if exists "admin_write_service_images" on storage.objects;
create policy "admin_write_service_images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'service-images' and is_admin());

drop policy if exists "admin_update_service_images" on storage.objects;
create policy "admin_update_service_images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'service-images' and is_admin());

drop policy if exists "admin_delete_service_images" on storage.objects;
create policy "admin_delete_service_images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'service-images' and is_admin());
