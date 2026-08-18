-- Applied to project lyclaplowwxocbuuigyu. Keep this file for reproducible environments.
create table if not exists public.cms_documents (id text primary key, content jsonb not null default '{}'::jsonb, is_published boolean not null default false, updated_at timestamptz not null default now(), updated_by uuid);
alter table public.cms_documents enable row level security;
revoke all on public.cms_documents from anon, authenticated;
grant select on public.cms_documents to anon, authenticated;
grant insert, update, delete on public.cms_documents to authenticated;
create policy "Public reads published CMS" on public.cms_documents for select to anon, authenticated using (is_published or (select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid);
create policy "Approved administrator inserts CMS" on public.cms_documents for insert to authenticated with check ((select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid and updated_by=(select auth.uid()));
create policy "Approved administrator updates CMS" on public.cms_documents for update to authenticated using ((select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid) with check ((select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid and updated_by=(select auth.uid()));
create policy "Approved administrator deletes CMS" on public.cms_documents for delete to authenticated using ((select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid);
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('cms-images','cms-images',true,5242880,array['image/jpeg','image/png','image/webp','image/gif']) on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "Approved administrator inserts CMS images" on storage.objects for insert to authenticated with check(bucket_id='cms-images' and (select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid);
create policy "Approved administrator updates CMS images" on storage.objects for update to authenticated using(bucket_id='cms-images' and (select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid) with check(bucket_id='cms-images' and (select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid);
create policy "Approved administrator deletes CMS images" on storage.objects for delete to authenticated using(bucket_id='cms-images' and (select auth.uid())='b0bc13c2-bee0-4bec-a4a3-7a5d84ba60ab'::uuid);
