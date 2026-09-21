-- E-Print phase 2: customer / investor / admin roles, deployment requests,
-- investor applications, documents, messages, contact form, private storage.
--
-- Run ONCE in the Supabase dashboard (SQL Editor -> New query -> paste -> Run),
-- AFTER supabase/schema.sql. It migrates the existing `applications` table into
-- `deployment_requests` and turns the old `partner` role into `customer`.
--
-- Security model
--   * Row-level security on every table; owners see only their own rows, admins see all.
--   * Column-level grants: users can never write status / review / role columns.
--   * Government ID images live in a private bucket only admins can read.
--   * Documents live in a private bucket: owner + admin can read.

-- 1. Profiles -----------------------------------------------------------------

alter table public.profiles
  add column if not exists first_name text not null default '' check (char_length(first_name) <= 50),
  add column if not exists last_name text not null default '' check (char_length(last_name) <= 50),
  add column if not exists phone text not null default '' check (char_length(phone) <= 20),
  add column if not exists consented_at timestamptz;

update public.profiles set first_name = left(full_name, 50) where first_name = '';

-- Drop the old constraint first: it only allows 'partner' and 'admin'.
alter table public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role = 'customer' where role = 'partner';
alter table public.profiles
  add constraint profiles_role_check check (role in ('customer', 'investor', 'admin'));
alter table public.profiles alter column role set default 'customer';

-- 2. Helper functions -----------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_user_role()
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- 3. Deployment requests ----------------------------------------------------------

create table if not exists public.deployment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    constraint deployment_requests_user_id_fkey references public.profiles (id) on delete cascade,
  deployment_type text not null
    check (deployment_type in ('school', 'office', 'business', 'organization', 'commercial', 'sari_sari_store', 'other')),
  site_name text not null check (char_length(site_name) between 1 and 150),
  site_location text not null check (char_length(site_location) between 1 and 300),
  description text not null default '' check (char_length(description) <= 1000),
  reason text not null default '' check (char_length(reason) <= 1000),
  consented_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'site_assessment', 'approved', 'scheduled', 'deployed', 'rejected')),
  admin_note text check (char_length(admin_note) <= 500),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deployment_requests_user_idx on public.deployment_requests (user_id, created_at desc);
create index if not exists deployment_requests_status_idx on public.deployment_requests (status, created_at desc);

-- Carry over anything submitted through the phase 1 form.
do $$
begin
  if to_regclass('public.applications') is not null then
    insert into public.deployment_requests
      (id, user_id, deployment_type, site_name, site_location, description, status,
       admin_note, reviewed_at, reviewed_by, created_at)
    select
      id, user_id, deployment_type, site_name, site_location,
      left(concat_ws(' | ', nullif(other_type, ''), nullif(school_level, ''), nullif(notes, '')), 1000),
      case status when 'in_review' then 'under_review' else status end,
      admin_note, reviewed_at, reviewed_by, created_at
    from public.applications
    on conflict (id) do nothing;

    drop table public.applications cascade;
  end if;
end $$;

drop trigger if exists deployment_requests_updated_at on public.deployment_requests;
create trigger deployment_requests_updated_at
  before update on public.deployment_requests
  for each row execute function public.set_updated_at();

-- 4. Investor applications ------------------------------------------------------------

create table if not exists public.investor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique
    constraint investor_applications_user_id_fkey references public.profiles (id) on delete cascade,
  business_name text not null check (char_length(business_name) between 1 and 150),
  business_background text not null check (char_length(business_background) between 1 and 2000),
  investment_interest text not null check (char_length(investment_interest) between 1 and 1000),
  partnership_type text not null
    check (partnership_type in ('investor', 'business_partner', 'deployment_partner', 'strategic_partner', 'other')),
  location text not null check (char_length(location) between 1 and 200),
  id_type text not null
    check (id_type in ('passport', 'drivers_license', 'umid', 'philsys', 'sss', 'prc', 'postal', 'voters', 'other')),
  -- AES-256-GCM ciphertext (base64), encrypted by the server before it reaches here.
  id_number_enc text not null,
  id_number_last4 text not null check (char_length(id_number_last4) <= 4),
  -- Path inside the private `investor-ids` bucket.
  id_file_path text not null,
  consented_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'under_review', 'verification', 'for_discussion', 'approved', 'not_approved')),
  admin_note text check (char_length(admin_note) <= 500),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists investor_applications_status_idx on public.investor_applications (status, created_at desc);

-- Applicants may edit their details, but never the review columns. Admins (and
-- the SQL editor, where auth.uid() is null) are unrestricted.
create or replace function public.lock_investor_review_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.user_id := old.user_id;
    new.status := old.status;
    new.admin_note := old.admin_note;
    new.reviewed_at := old.reviewed_at;
    new.reviewed_by := old.reviewed_by;
    new.consented_at := old.consented_at;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists investor_applications_lock on public.investor_applications;
create trigger investor_applications_lock
  before update on public.investor_applications
  for each row execute function public.lock_investor_review_fields();

-- 5. Documents (metadata for files in the private `documents` bucket) -------------------

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  deployment_request_id uuid references public.deployment_requests (id) on delete cascade,
  investor_application_id uuid references public.investor_applications (id) on delete cascade,
  kind text not null check (kind in ('location_photo', 'supporting')),
  path text not null unique,
  filename text not null check (char_length(filename) between 1 and 200),
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'application/pdf')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 5242880),
  created_at timestamptz not null default now(),
  check ((deployment_request_id is null) <> (investor_application_id is null))
);

create index if not exists documents_request_idx on public.documents (deployment_request_id);
create index if not exists documents_investor_idx on public.documents (investor_application_id);

-- 6. Messages: status updates, admin notes, and replies from the user -----------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  -- The user whose thread this belongs to (not necessarily the sender).
  user_id uuid not null references public.profiles (id) on delete cascade,
  sender text not null check (sender in ('user', 'admin', 'system')),
  body text not null check (char_length(body) between 1 and 2000),
  related_kind text check (related_kind in ('deployment', 'investor')),
  related_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_thread_idx on public.messages (user_id, created_at desc);

-- Every status change leaves a message on the user's thread automatically.
create or replace function public.notify_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  kind text := tg_argv[0];
  label text;
  msg text;
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  label := case new.status
    when 'pending' then 'Pending'
    when 'under_review' then 'Under Review'
    when 'site_assessment' then 'Site Assessment'
    when 'approved' then case kind when 'investor' then 'Approved / Partnership Discussion' else 'Approved' end
    when 'scheduled' then 'Scheduled for Deployment'
    when 'deployed' then 'Deployed'
    when 'rejected' then 'Rejected'
    when 'verification' then 'Verification'
    when 'for_discussion' then 'For Discussion'
    when 'not_approved' then 'Not Approved'
    else new.status
  end;

  msg := 'Your ' || case kind when 'investor' then 'investor application' else 'deployment request' end
      || ' status is now: ' || label || '.';
  if coalesce(new.admin_note, '') <> '' then
    msg := msg || ' Note from E-Print: ' || new.admin_note;
  end if;

  insert into public.messages (user_id, sender, body, related_kind, related_id)
  values (new.user_id, 'system', left(msg, 2000), kind, new.id);

  return new;
end;
$$;

drop trigger if exists deployment_requests_notify on public.deployment_requests;
create trigger deployment_requests_notify
  after update of status on public.deployment_requests
  for each row execute function public.notify_status_change('deployment');

drop trigger if exists investor_applications_notify on public.investor_applications;
create trigger investor_applications_notify
  after update of status on public.investor_applications
  for each row execute function public.notify_status_change('investor');

-- 7. Public contact form -----------------------------------------------------------------

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  subject text not null check (char_length(subject) between 1 and 150),
  message text not null check (char_length(message) between 1 and 3000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- 8. Sign-up trigger: profile from metadata (role limited to customer / investor) ----------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  first text := left(coalesce(meta ->> 'first_name', ''), 50);
  last text := left(coalesce(meta ->> 'last_name', ''), 50);
begin
  insert into public.profiles
    (id, first_name, last_name, full_name, email, phone, address, role, consented_at)
  values (
    new.id,
    first,
    last,
    left(trim(concat_ws(' ', first, last)), 100),
    new.email,
    left(coalesce(meta ->> 'phone', ''), 20),
    left(coalesce(meta ->> 'address', ''), 300),
    -- Never trust metadata for privileged roles: only these two are possible.
    case when meta ->> 'account_type' = 'investor' then 'investor' else 'customer' end,
    case when meta ->> 'consent' = 'true' then now() end
  );
  return new;
end;
$$;

-- 9. Row-level security ----------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.deployment_requests enable row level security;
alter table public.investor_applications enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.contact_messages enable row level security;

-- profiles: read own or admin; only admins change anything (role management).
drop policy if exists "read own profile or admin" on public.profiles;
create policy "read own profile or admin" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles" on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- deployment_requests
drop policy if exists "read own request or admin" on public.deployment_requests;
create policy "read own request or admin" on public.deployment_requests for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "customers create requests" on public.deployment_requests;
create policy "customers create requests" on public.deployment_requests for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and public.current_user_role() = 'customer');
drop policy if exists "admin updates requests" on public.deployment_requests;
create policy "admin updates requests" on public.deployment_requests for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- investor_applications
drop policy if exists "read own application or admin" on public.investor_applications;
create policy "read own application or admin" on public.investor_applications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "investors create application" on public.investor_applications;
create policy "investors create application" on public.investor_applications for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending' and public.current_user_role() = 'investor');
drop policy if exists "investors edit while open" on public.investor_applications;
create policy "investors edit while open" on public.investor_applications for update to authenticated
  using (user_id = auth.uid() and status in ('pending', 'under_review', 'verification'))
  with check (user_id = auth.uid());
drop policy if exists "admin updates applications" on public.investor_applications;
create policy "admin updates applications" on public.investor_applications for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- documents: owner can add documents only to their own request/application.
drop policy if exists "read own documents or admin" on public.documents;
create policy "read own documents or admin" on public.documents for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "add documents to own records" on public.documents;
create policy "add documents to own records" on public.documents for insert to authenticated
  with check (
    user_id = auth.uid()
    and (
      exists (select 1 from public.deployment_requests r
              where r.id = deployment_request_id and r.user_id = auth.uid())
      or exists (select 1 from public.investor_applications a
              where a.id = investor_application_id and a.user_id = auth.uid())
    )
  );

-- messages
drop policy if exists "read own thread or admin" on public.messages;
create policy "read own thread or admin" on public.messages for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "users write to own thread" on public.messages;
create policy "users write to own thread" on public.messages for insert to authenticated
  with check (user_id = auth.uid() and sender = 'user');
drop policy if exists "admin writes to any thread" on public.messages;
create policy "admin writes to any thread" on public.messages for insert to authenticated
  with check (public.is_admin() and sender = 'admin');
drop policy if exists "mark own messages read" on public.messages;
create policy "mark own messages read" on public.messages for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- contact_messages: anyone can send; only admins read/handle.
drop policy if exists "anyone can send contact message" on public.contact_messages;
create policy "anyone can send contact message" on public.contact_messages for insert to anon, authenticated
  with check (handled = false);
drop policy if exists "admin reads contact messages" on public.contact_messages;
create policy "admin reads contact messages" on public.contact_messages for select to authenticated
  using (public.is_admin());
drop policy if exists "admin handles contact messages" on public.contact_messages;
create policy "admin handles contact messages" on public.contact_messages for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 10. Column-level grants (defence in depth: users can't even name privileged columns) ----------

revoke all on public.profiles, public.deployment_requests, public.investor_applications,
  public.documents, public.messages, public.contact_messages from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (role) on public.profiles to authenticated;

grant select on public.deployment_requests to authenticated;
grant insert (id, user_id, deployment_type, site_name, site_location, description, reason)
  on public.deployment_requests to authenticated;
grant update (status, admin_note, reviewed_at, reviewed_by) on public.deployment_requests to authenticated;

grant select on public.investor_applications to authenticated;
grant insert (id, user_id, business_name, business_background, investment_interest,
              partnership_type, location, id_type, id_number_enc, id_number_last4, id_file_path)
  on public.investor_applications to authenticated;
grant update (business_name, business_background, investment_interest, partnership_type, location,
              id_type, id_number_enc, id_number_last4, id_file_path,
              status, admin_note, reviewed_at, reviewed_by)
  on public.investor_applications to authenticated;

grant select on public.documents to authenticated;
grant insert (id, user_id, deployment_request_id, investor_application_id, kind, path, filename, mime_type, size_bytes)
  on public.documents to authenticated;

grant select on public.messages to authenticated;
grant insert (user_id, sender, body, related_kind, related_id) on public.messages to authenticated;
grant update (read_at) on public.messages to authenticated;

grant insert (name, email, subject, message) on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated;
grant update (handled) on public.contact_messages to authenticated;

revoke execute on function public.is_admin(), public.current_user_role() from public, anon;
grant execute on function public.is_admin(), public.current_user_role() to authenticated;

-- 11. Private storage buckets ----------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('documents', 'documents', false, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('investor-ids', 'investor-ids', false, 5242880,
   array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Files are stored as <user id>/<...>. Users can only touch their own folder.
drop policy if exists "documents: upload to own folder" on storage.objects;
create policy "documents: upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "documents: read own or admin" on storage.objects;
create policy "documents: read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'documents'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists "documents: delete own" on storage.objects;
create policy "documents: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- Government IDs: an applicant can upload, see and remove their OWN ID (Postgres needs
-- read access to a row before it lets someone delete it); admins can read all of them;
-- nobody else can read any.
drop policy if exists "ids: upload to own folder" on storage.objects;
create policy "ids: upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'investor-ids' and (storage.foldername(name))[1] = auth.uid()::text
              and public.current_user_role() = 'investor');

drop policy if exists "ids: admin reads" on storage.objects;
drop policy if exists "ids: read own or admin" on storage.objects;
create policy "ids: read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'investor-ids'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

drop policy if exists "ids: delete own" on storage.objects;
create policy "ids: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'investor-ids' and (storage.foldername(name))[1] = auth.uid()::text);

-- 12. Reminder -----------------------------------------------------------------------------------
-- Make yourself the admin (after signing up on the site):
--   update public.profiles set role = 'admin' where email = 'you@example.com';
