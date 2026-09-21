-- E-Print partner accounts + applications.
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- 1. Tables -----------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  email text not null,
  address text not null default '' check (char_length(address) <= 300),
  role text not null default 'partner' check (role in ('partner', 'admin')),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique
    constraint applications_user_id_fkey references public.profiles (id) on delete cascade,
  deployment_type text not null check (deployment_type in ('school', 'sari_sari_store', 'other')),
  site_name text not null check (char_length(site_name) between 1 and 150),
  site_location text not null check (char_length(site_location) between 1 and 300),
  school_level text check (school_level in ('elementary', 'high_school', 'college')),
  other_type text check (char_length(other_type) <= 100),
  notes text check (char_length(notes) <= 1000),
  status text not null default 'pending'
    check (status in ('pending', 'in_review', 'approved', 'rejected')),
  admin_note text check (char_length(admin_note) <= 500),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index applications_status_idx on public.applications (status, created_at desc);

-- 2. Admin check (security definer so policies don't recurse into profiles) --

create function public.is_admin()
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

-- 3. Row-level security -------------------------------------------------------
-- Partners can only read their own rows. Only admins can change an application.
-- Nobody can edit a profile from the browser, so nobody can promote themselves.

alter table public.profiles enable row level security;
alter table public.applications enable row level security;

create policy "read own profile or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "read own application or admin"
  on public.applications for select
  using (user_id = auth.uid() or public.is_admin());

create policy "admin updates applications"
  on public.applications for update
  using (public.is_admin())
  with check (public.is_admin());

-- 4. Create profile + application automatically when someone signs up ---------
-- The website sends the form values as sign-up metadata, so this works whether
-- or not "Confirm email" is turned on. role is never read from metadata.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  app jsonb := meta -> 'application';
begin
  insert into public.profiles (id, full_name, email, address)
  values (new.id, coalesce(meta ->> 'full_name', ''), new.email, coalesce(meta ->> 'address', ''));

  if app is not null then
    insert into public.applications
      (user_id, deployment_type, site_name, site_location, school_level, other_type, notes)
    values (
      new.id,
      app ->> 'deployment_type',
      app ->> 'site_name',
      app ->> 'site_location',
      nullif(app ->> 'school_level', ''),
      nullif(app ->> 'other_type', ''),
      nullif(app ->> 'notes', '')
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Make yourself the admin --------------------------------------------------
-- Create your own account first (sign up on the site, or Authentication -> Users -> Add user),
-- then run this with your email:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
