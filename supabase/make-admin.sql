-- Makes the account registered with this email an admin.
-- Run in the Supabase SQL Editor AFTER phase2.sql, and AFTER you have registered
-- on the website with this email (the account must exist first).

update public.profiles
set role = 'admin'
where email = 'nerrenzemarata@gmail.com';

-- Should return one row with role = 'admin':
select email, role from public.profiles where email = 'nerrenzemarata@gmail.com';
