-- =============================================================
-- TGPCOP 2.0 — MIGRATION: Staff Roles, Invitations & Album Gallery
-- Run this ON TOP of schema.sql (on the existing database).
-- Safe to re-run (idempotent where possible).
-- =============================================================

-- -------------------------------------------------------------
-- 1) ROLE SYSTEM
-- -------------------------------------------------------------
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin','teacher','lab_assistant','librarian','media_team','student','club_manager'));

-- migrate legacy role name
update public.profiles set role = 'teacher' where role = 'faculty';

-- staff helper functions
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$ select public.current_role() = 'admin' $$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.current_role() in
    ('admin','teacher','lab_assistant','librarian','media_team')
$$;

-- -------------------------------------------------------------
-- 2) PROFILES EXTENSION
-- -------------------------------------------------------------
alter table public.profiles
  add column if not exists email text,
  add column if not exists department text,
  add column if not exists designation text,
  add column if not exists status text not null default 'active';

alter table public.profiles drop constraint if exists profiles_status_check;
alter table public.profiles
  add constraint profiles_status_check
  check (status in ('active','invited','suspended'));

-- keep profiles.email aligned with the auth email
update public.profiles p
set email = u.email
from auth.users u
where p.user_id = u.id and (p.email is null or p.email <> u.email);

-- -------------------------------------------------------------
-- 3) STAFF INVITATIONS
-- The college has no SMTP/domain email configured yet, so staff
-- accounts are recorded as pending invitations. When the person
-- registers with the invited email, the role is applied
-- automatically by the signup trigger below.
-- -------------------------------------------------------------
create table if not exists public.staff_invitations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin','teacher','lab_assistant','librarian','media_team')),
  department text,
  designation text,
  phone text,
  photo_url text,
  status text not null default 'pending'
    check (status in ('pending','activated','revoked')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_staff_invitations_email on public.staff_invitations(email);

alter table public.staff_invitations enable row level security;

drop policy if exists "staff_invitations_admin_all" on public.staff_invitations;
create policy "staff_invitations_admin_all" on public.staff_invitations
  for all using (public.is_admin()) with check (public.is_admin());

-- apply invitation role at signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_role text;
begin
  -- If this email was invited as staff, activate the invitation and use its role
  select role into invited_role
  from public.staff_invitations
  where lower(email) = lower(new.email) and status = 'pending'
  limit 1;

  insert into public.profiles (user_id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(invited_role, 'student'),
    'active'
  )
  on conflict (user_id) do nothing;

  if invited_role is not null then
    update public.staff_invitations
    set status = 'activated', updated_at = now()
    where lower(email) = lower(new.email) and status = 'pending';
  end if;

  return new;
end;
$$;

-- -------------------------------------------------------------
-- 4) ALBUM-BASED GALLERY
-- -------------------------------------------------------------
create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date,
  category text not null default 'other'
    check (category in ('events','academic','sports','cultural','campus',
                        'independence_day','republic_day','workshops','seminars',
                        'student_activities','lab','library','other')),
  cover_image_url text,
  photo_count int not null default 0,
  status text not null default 'draft'
    check (status in ('draft','pending_approval','published','archived')),
  visibility text not null default 'public' check (visibility in ('public','private')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_gallery_albums_status on public.gallery_albums(status, event_date desc);
create index if not exists idx_gallery_albums_creator on public.gallery_albums(created_by);

create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  image_url text not null,
  storage_path text not null,
  caption text,
  alt_text text,
  sort_order int not null default 0,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_gallery_photos_album on public.gallery_photos(album_id, sort_order);

alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;

-- Albums: public sees published; staff see their own; admins see everything
drop policy if exists "gallery_albums_select" on public.gallery_albums;
create policy "gallery_albums_select" on public.gallery_albums
  for select using (
    status = 'published'
    or public.is_admin()
    or created_by = auth.uid()
  );

-- Only admins may publish; staff create drafts / submit for approval
drop policy if exists "gallery_albums_insert" on public.gallery_albums;
create policy "gallery_albums_insert" on public.gallery_albums
  for insert with check (
    public.is_admin()
    or (public.is_staff() and created_by = auth.uid()
        and status in ('draft','pending_approval'))
  );

-- Admins edit anything; creators edit while not published
drop policy if exists "gallery_albums_update" on public.gallery_albums;
create policy "gallery_albums_update" on public.gallery_albums
  for update using (
    public.is_admin() or (created_by = auth.uid() and status <> 'published')
  )
  with check (
    public.is_admin()
    or (created_by = auth.uid() and status in ('draft','pending_approval','archived'))
  );

drop policy if exists "gallery_albums_delete" on public.gallery_albums;
create policy "gallery_albums_delete" on public.gallery_albums
  for delete using (public.is_admin() or (created_by = auth.uid() and status <> 'published'));

-- Photos: visible when the parent album is visible (or uploader/admin)
drop policy if exists "gallery_photos_select" on public.gallery_photos;
create policy "gallery_photos_select" on public.gallery_photos
  for select using (
    public.is_admin()
    or uploaded_by = auth.uid()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id and a.status = 'published'
    )
  );

drop policy if exists "gallery_photos_insert" on public.gallery_photos;
create policy "gallery_photos_insert" on public.gallery_photos
  for insert with check (
    public.is_staff()
    and exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id
        and (public.is_admin() or a.created_by = auth.uid())
        and (public.is_admin() or a.status <> 'published')
    )
  );

drop policy if exists "gallery_photos_update" on public.gallery_photos;
create policy "gallery_photos_update" on public.gallery_photos
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id
        and a.created_by = auth.uid() and (public.is_admin() or a.status <> 'published')
    )
  );

drop policy if exists "gallery_photos_delete" on public.gallery_photos;
create policy "gallery_photos_delete" on public.gallery_photos
  for delete using (
    public.is_admin()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id
        and a.created_by = auth.uid() and (public.is_admin() or a.status <> 'published')
    )
  );

-- -------------------------------------------------------------
-- 5) PROGRAMS: short name for cards
-- -------------------------------------------------------------
alter table public.programs add column if not exists short_name text;

-- -------------------------------------------------------------
-- 6) AUDIT LOGS: staff can append their own entries
-- -------------------------------------------------------------
drop policy if exists "audit_logs_insert_own" on public.audit_logs;
create policy "audit_logs_insert_own" on public.audit_logs
  for insert to authenticated
  with check (user_id = auth.uid());

-- -------------------------------------------------------------
-- 7) VERIFICATION VIEW: include semester
-- -------------------------------------------------------------
drop view if exists public.student_verifications;
create view public.student_verifications as
  select prn,
         split_part(full_name, ' ', 1)
           || ' ' || coalesce(upper(left(split_part(full_name, ' ', -1), 1)) || '.', '') as display_name,
         course,
         year,
         semester,
         verification_status
  from public.students
  where verification_status = 'approved';

grant select on public.student_verifications to anon, authenticated;

-- -------------------------------------------------------------
-- 8) STORAGE
-- -------------------------------------------------------------
-- 8) STORAGE
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('gallery', 'gallery', true),
  ('student-profiles', 'student-profiles', true),
  ('documents', 'documents', true),
  ('resources', 'resources', true),
  ('campus-images', 'campus-images', true),
  ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

-- Public read for gallery, documents, resources, campus buckets
drop policy if exists "public_read_gallery" on storage.objects;
create policy "public_read_gallery" on storage.objects
  for select using (bucket_id in ('gallery', 'documents', 'resources', 'campus-images', 'event-images'));

-- Staff/Admin can upload gallery images
drop policy if exists "staff_upload_gallery" on storage.objects;
create policy "staff_upload_gallery" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery' and (public.is_staff() or public.is_admin()));

-- Staff/Admin can update gallery images
drop policy if exists "staff_update_gallery" on storage.objects;
create policy "staff_update_gallery" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery' and (public.is_staff() or public.is_admin()));

-- Staff/Admin can delete gallery images
drop policy if exists "staff_delete_gallery" on storage.objects;
drop policy if exists "staff_delete_own_gallery" on storage.objects;
create policy "staff_delete_gallery" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery' and (public.is_admin() or owner = auth.uid()));

-- Documents & Notices: Staff/Admin upload, update, delete
drop policy if exists "staff_upload_documents" on storage.objects;
create policy "staff_upload_documents" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('documents', 'resources') and (public.is_staff() or public.is_admin()));

drop policy if exists "staff_update_documents" on storage.objects;
create policy "staff_update_documents" on storage.objects
  for update to authenticated
  using (bucket_id in ('documents', 'resources') and (public.is_staff() or public.is_admin()));

drop policy if exists "staff_delete_documents" on storage.objects;
create policy "staff_delete_documents" on storage.objects
  for delete to authenticated
  using (bucket_id in ('documents', 'resources') and (public.is_admin() or owner = auth.uid()));

-- Program images: staff upload to campus-images
drop policy if exists "staff_upload_campus" on storage.objects;
create policy "staff_upload_campus" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'campus-images' and (public.is_staff() or public.is_admin()));

-- Student profile photos: public read, owner write
drop policy if exists "public_read_student_profiles" on storage.objects;
create policy "public_read_student_profiles" on storage.objects
  for select using (bucket_id = 'student-profiles');

drop policy if exists "owner_write_student_profiles" on storage.objects;
create policy "owner_write_student_profiles" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "owner_update_student_profiles" on storage.objects;
create policy "owner_update_student_profiles" on storage.objects
  for update to authenticated
  using (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "owner_delete_student_profiles" on storage.objects;
create policy "owner_delete_student_profiles" on storage.objects
  for delete to authenticated
  using (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

