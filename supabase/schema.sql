-- =============================================================
-- TGPCOP 2.0 — Supabase Database Schema
-- Run this in the Supabase SQL Editor (or via supabase CLI).
-- Includes tables, indexes, triggers and RLS policies.
--
-- Ordering matters: all tables are created BEFORE any function,
-- view or policy that references them (Postgres validates SQL
-- function bodies and foreign keys at creation time).
-- =============================================================

-- =============================================================
-- 1) TABLES
-- =============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'student'
    check (role in ('admin','teacher','lab_assistant','librarian','media_team','student','club_manager','faculty')),
  department text,
  designation text,
  status text not null default 'active'
    check (status in ('active','invited','suspended')),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_profiles_user_id on public.profiles(user_id);

-- ---------- staff invitations ----------
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

-- Auto-create profile on signup (role defaults to student, or staff invitation role if invited)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invited_role text;
begin
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- faculty (created before departments: departments references it) ----------
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  designation text not null,
  department text,
  qualification text,
  experience text,
  email text,
  phone text,
  photo_url text,
  specialization text,
  bio text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_faculty_active on public.faculty(is_active, sort_order);

-- ---------- departments ----------
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  description text,
  head_id uuid references public.faculty(id) on delete set null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- programs ----------
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  type text not null check (type in ('bpharm','dpharm')),
  duration text,
  seats int,
  eligibility text,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- students ----------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  prn text not null unique,
  full_name text not null,
  email text not null,
  phone text,
  course text not null check (course in ('bpharm','dpharm')),
  year int not null default 1 check (year between 1 and 4),
  semester int not null default 1 check (semester between 1 and 8),
  department text,
  profile_image text,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_students_user_id on public.students(user_id);
create index if not exists idx_students_verification on public.students(verification_status);

-- ---------- events ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  banner_url text,
  date date not null,
  time text,
  venue text,
  organizer text,
  registration_deadline timestamptz,
  registration_link text,
  status text not null default 'upcoming'
    check (status in ('upcoming','ongoing','completed','cancelled')),
  category text,
  is_online boolean not null default false,
  max_participants int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_events_status_date on public.events(status, date);

-- ---------- event_registrations ----------
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  student_id uuid references public.students(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  status text not null default 'registered'
    check (status in ('registered','confirmed','cancelled')),
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);
create index if not exists idx_event_regs_event on public.event_registrations(event_id);
create index if not exists idx_event_regs_user on public.event_registrations(user_id);

-- ---------- news ----------
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  content text,
  image_url text,
  author_id uuid references auth.users(id) on delete set null,
  category text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_news_status on public.news(status, published_at);

-- ---------- notices ----------
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  content text,
  pdf_url text,
  priority text not null default 'medium'
    check (priority in ('low','medium','high','urgent')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  is_pinned boolean not null default false,
  publish_date timestamptz,
  expiry_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_notices_status on public.notices(status, publish_date);

-- ---------- resources ----------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  file_type text not null default 'pdf',
  file_size bigint not null default 0,
  course text not null default 'both' check (course in ('bpharm','dpharm','both')),
  year int,
  semester int,
  subject text,
  category text not null check (category in
    ('notes','study_material','question_papers','syllabus','previous_year','useful_links','other')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  uploaded_by uuid references auth.users(id) on delete set null,
  download_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_resources_status on public.resources(status, created_at);

-- ---------- clubs ----------
create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  logo_url text,
  cover_url text,
  category text,
  is_active boolean not null default true,
  member_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  student_id uuid references public.students(id) on delete cascade,
  role text not null default 'member'
    check (role in ('member','lead','co_lead','faculty_advisor')),
  joined_at timestamptz not null default now(),
  unique (club_id, user_id)
);

-- ---------- gallery & albums ----------
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

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  image_url text not null,
  thumbnail_url text,
  category text not null default 'other'
    check (category in ('campus','events','academic','sports','activities','other')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_gallery_active on public.gallery(is_active, created_at);

-- ---------- research ----------
create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  faculty_id uuid references public.faculty(id) on delete set null,
  status text not null default 'proposed' check (status in ('ongoing','completed','proposed')),
  area text,
  start_date date,
  end_date date,
  funding text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text,
  journal text,
  year int,
  doi text,
  url text,
  faculty_id uuid references public.faculty(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- placements ----------
create table if not exists public.placements (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  role text,
  package_lpa numeric,
  year int,
  student_count int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- enquiries & messages ----------
create table if not exists public.admission_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  course text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','converted','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_enquiries_status on public.admission_enquiries(status, created_at);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- certificates ----------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  description text,
  certificate_url text not null,
  issued_date date,
  type text,
  created_at timestamptz not null default now()
);
create index if not exists idx_certificates_student on public.certificates(student_id);

-- ---------- site settings & announcements ----------
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text,
  type text not null default 'string' check (type in ('string','number','boolean','json')),
  category text,
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  link text,
  priority int not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- audit logs ----------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- =============================================================
-- 2) HELPER FUNCTIONS (after tables they reference)
-- =============================================================

-- Role check used by every RLS policy
create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role::text from public.profiles where user_id = auth.uid()),
    'anon'
  )
$$;

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

-- =============================================================
-- 3) PUBLIC VERIFICATION VIEW (masks private data at the DB level)
-- =============================================================

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

-- =============================================================
-- 4) ROW LEVEL SECURITY
-- =============================================================

alter table public.profiles enable row level security;
alter table public.staff_invitations enable row level security;
alter table public.students enable row level security;
alter table public.departments enable row level security;
alter table public.faculty enable row level security;
alter table public.programs enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.news enable row level security;
alter table public.notices enable row level security;
alter table public.resources enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.gallery enable row level security;
alter table public.research_projects enable row level security;
alter table public.publications enable row level security;
alter table public.placements enable row level security;
alter table public.admission_enquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.certificates enable row level security;
alter table public.site_settings enable row level security;
alter table public.announcements enable row level security;
alter table public.audit_logs enable row level security;

-- ---------- profiles ----------
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (user_id = auth.uid() or public.is_admin());
create policy "profiles_insert_self" on public.profiles
  for insert with check (user_id = auth.uid() or public.is_admin());

-- ---------- staff invitations ----------
create policy "staff_invitations_admin_all" on public.staff_invitations
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- students ----------
create policy "students_select_own_or_admin" on public.students
  for select using (user_id = auth.uid() or public.is_admin());
create policy "students_insert_self" on public.students
  for insert with check (user_id = auth.uid());
create policy "students_update_own_or_admin" on public.students
  for update using (user_id = auth.uid() or public.is_admin());

-- ---------- public content (read for everyone, write for admins) ----------
create policy "faculty_public_read" on public.faculty
  for select using (true);
create policy "faculty_admin_write" on public.faculty
  for all using (public.is_admin()) with check (public.is_admin());

create policy "departments_public_read" on public.departments
  for select using (true);
create policy "departments_admin_write" on public.departments
  for all using (public.is_admin()) with check (public.is_admin());

create policy "programs_public_read" on public.programs
  for select using (true);
create policy "programs_admin_write" on public.programs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "events_public_read" on public.events
  for select using (true);
create policy "events_admin_write" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

create policy "news_public_read" on public.news
  for select using (status = 'published' or public.is_admin());
create policy "news_admin_write" on public.news
  for all using (public.is_admin()) with check (public.is_admin());

create policy "notices_public_read" on public.notices
  for select using (status = 'published' or public.is_admin());
create policy "notices_admin_write" on public.notices
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- gallery albums & photos ----------
create policy "gallery_albums_select" on public.gallery_albums
  for select using (
    status = 'published'
    or public.is_admin()
    or created_by = auth.uid()
  );

create policy "gallery_albums_insert" on public.gallery_albums
  for insert with check (
    public.is_admin()
    or (public.is_staff() and created_by = auth.uid()
        and status in ('draft','pending_approval'))
  );

create policy "gallery_albums_update" on public.gallery_albums
  for update using (
    public.is_admin() or (created_by = auth.uid() and status <> 'published')
  )
  with check (
    public.is_admin()
    or (created_by = auth.uid() and status in ('draft','pending_approval','archived'))
  );

create policy "gallery_albums_delete" on public.gallery_albums
  for delete using (public.is_admin() or (created_by = auth.uid() and status <> 'published'));

create policy "gallery_photos_select" on public.gallery_photos
  for select using (
    public.is_admin()
    or uploaded_by = auth.uid()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id and a.status = 'published'
    )
  );

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

create policy "gallery_photos_update" on public.gallery_photos
  for update using (
    public.is_admin()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id
        and a.created_by = auth.uid() and (public.is_admin() or a.status <> 'published')
    )
  );

create policy "gallery_photos_delete" on public.gallery_photos
  for delete using (
    public.is_admin()
    or exists (
      select 1 from public.gallery_albums a
      where a.id = gallery_photos.album_id
        and a.created_by = auth.uid() and (public.is_admin() or a.status <> 'published')
    )
  );

create policy "gallery_public_read" on public.gallery
  for select using (is_active = true or public.is_admin());
create policy "gallery_admin_write" on public.gallery
  for all using (public.is_admin()) with check (public.is_admin());

create policy "clubs_public_read" on public.clubs
  for select using (true);
create policy "clubs_admin_write" on public.clubs
  for all using (public.is_admin()) with check (public.is_admin());

create policy "club_members_public_read" on public.club_members
  for select using (true);
create policy "club_members_authenticated_write" on public.club_members
  for all using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "research_public_read" on public.research_projects
  for select using (true);
create policy "research_admin_write" on public.research_projects
  for all using (public.is_admin()) with check (public.is_admin());

create policy "publications_public_read" on public.publications
  for select using (true);
create policy "publications_admin_write" on public.publications
  for all using (public.is_admin()) with check (public.is_admin());

create policy "placements_public_read" on public.placements
  for select using (is_active = true or public.is_admin());
create policy "placements_admin_write" on public.placements
  for all using (public.is_admin()) with check (public.is_admin());

create policy "announcements_public_read" on public.announcements
  for select using (is_active = true or public.is_admin());
create policy "announcements_admin_write" on public.announcements
  for all using (public.is_admin()) with check (public.is_admin());

create policy "site_settings_public_read" on public.site_settings
  for select using (true);
create policy "site_settings_admin_write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- resources ----------
create policy "resources_public_read_approved" on public.resources
  for select using (
    status = 'approved'
    or uploaded_by = auth.uid()
    or public.is_admin()
  );
create policy "resources_student_insert" on public.resources
  for insert with check (
    auth.uid() is not null
    and uploaded_by = auth.uid()
    and status = 'pending'
  );
create policy "resources_owner_update" on public.resources
  for update using (
    (uploaded_by = auth.uid() and status = 'pending')
    or public.is_admin()
  );
create policy "resources_owner_delete" on public.resources
  for delete using (uploaded_by = auth.uid() or public.is_admin());

-- ---------- event registrations ----------
create policy "event_regs_read_own_or_admin" on public.event_registrations
  for select using (user_id = auth.uid() or public.is_admin());
create policy "event_regs_insert_own" on public.event_registrations
  for insert with check (user_id = auth.uid());
create policy "event_regs_update_own_or_admin" on public.event_registrations
  for update using (user_id = auth.uid() or public.is_admin());

-- ---------- enquiries & messages (public can submit; only admin reads) ----------
create policy "enquiries_public_insert" on public.admission_enquiries
  for insert with check (true);
create policy "enquiries_admin_read" on public.admission_enquiries
  for select using (public.is_admin());
create policy "enquiries_admin_update" on public.admission_enquiries
  for update using (public.is_admin());

create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);
create policy "contact_messages_admin_read" on public.contact_messages
  for select using (public.is_admin());
create policy "contact_messages_admin_update" on public.contact_messages
  for update using (public.is_admin());

-- ---------- certificates (owner or admin) ----------
create policy "certificates_read_own_or_admin" on public.certificates
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.students s
      where s.id = certificates.student_id and s.user_id = auth.uid()
    )
  );
create policy "certificates_admin_write" on public.certificates
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- audit logs ----------
create policy "audit_logs_admin_all" on public.audit_logs
  for all using (public.is_admin()) with check (public.is_admin());
create policy "audit_logs_insert_own" on public.audit_logs
  for insert to authenticated
  with check (user_id = auth.uid());

-- =============================================================
-- 5) STORAGE BUCKETS
-- =============================================================
insert into storage.buckets (id, name, public)
values
  ('campus-images', 'campus-images', true),
  ('event-images', 'event-images', true),
  ('gallery', 'gallery', true),
  ('student-profiles', 'student-profiles', true),
  ('faculty', 'faculty', true),
  ('resources', 'resources', true),
  ('documents', 'documents', true),
  ('certificates', 'certificates', false)
on conflict (id) do update set public = true;

-- Public read for public buckets
create policy "public_read_campus" on storage.objects
  for select using (bucket_id in ('campus-images','event-images','gallery','student-profiles','faculty','resources','documents'));

-- Staff/Admin can upload gallery images
create policy "staff_upload_gallery" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gallery' and (public.is_staff() or public.is_admin()));

create policy "staff_update_gallery" on storage.objects
  for update to authenticated
  using (bucket_id = 'gallery' and (public.is_staff() or public.is_admin()));

create policy "staff_delete_gallery" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gallery' and (public.is_admin() or owner = auth.uid()));

-- Staff/Admin can upload documents (notices, circulars, etc.)
create policy "staff_upload_documents" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('documents', 'resources') and (public.is_staff() or public.is_admin()));

create policy "staff_update_documents" on storage.objects
  for update to authenticated
  using (bucket_id in ('documents', 'resources') and (public.is_staff() or public.is_admin()));

create policy "staff_delete_documents" on storage.objects
  for delete to authenticated
  using (bucket_id in ('documents', 'resources') and (public.is_admin() or owner = auth.uid()));

-- Staff/Admin can upload program/campus images
create policy "staff_upload_campus" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'campus-images' and (public.is_staff() or public.is_admin()));

-- Student profile photos: public read, owner write
create policy "owner_write_student_profiles" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner_update_student_profiles" on storage.objects
  for update to authenticated
  using (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "owner_delete_student_profiles" on storage.objects
  for delete to authenticated
  using (bucket_id = 'student-profiles' and (storage.foldername(name))[1] = auth.uid()::text);

-- Authenticated uploads to resources
create policy "auth_upload_resources" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resources');

-- Owner can delete own resource files
create policy "owner_delete_resources" on storage.objects
  for delete to authenticated
  using (bucket_id = 'resources' and owner = auth.uid());

-- Admin full control
create policy "admin_all_storage" on storage.objects
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================
-- PROMOTE FIRST ADMIN (run manually, replace email):
-- update public.profiles set role = 'admin' where user_id = (
--   select id from auth.users where email = 'admin@tgpcop.com'
-- );
-- =============================================================
