-- Patch 1 for phase2.sql. Run once in the Supabase SQL Editor if you already ran the
-- original phase2.sql. (Fresh installs don't need it: phase2.sql already includes it.)
--
-- Fix: applicants could not delete their own government ID file (e.g. when replacing it),
-- because Postgres requires read access to a row before allowing its deletion. Now an
-- applicant can read and delete only their own ID folder; admins can still read all.

drop policy if exists "ids: admin reads" on storage.objects;
drop policy if exists "ids: read own or admin" on storage.objects;
create policy "ids: read own or admin" on storage.objects for select to authenticated
  using (bucket_id = 'investor-ids'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
