-- =====================================================================
-- Row Level Security policies.
--
-- The client's message says RLS is "already configured" on the existing
-- tables, but doesn't specify the exact policies, and explicitly asks
-- (section 16) for a proper admin-role authorization mechanism rather
-- than "every authenticated user is an admin". This file defines that
-- mechanism from scratch using `drop policy if exists` + `create policy`,
-- so it's safe to run even if some policies already exist -- it will
-- simply replace them with the versions below. Review before running
-- against a project with policies you want to keep as-is.
-- =====================================================================

-- ---- Helper: is the current request from a logged-in admin? ----
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admins a where a.user_id = auth.uid()
  );
$$;

-- ---- services ----
alter table services enable row level security;

drop policy if exists "public_read_active_services" on services;
create policy "public_read_active_services"
  on services for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "admin_manage_services" on services;
create policy "admin_manage_services"
  on services for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ---- appointments ----
alter table appointments enable row level security;

-- Public (including logged-out visitors) can create a booking request,
-- but can never read, update, or delete appointments -- their own or
-- anyone else's. This matches "Public users must NOT view appointments."
drop policy if exists "public_create_appointment" on appointments;
create policy "public_create_appointment"
  on appointments for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "admin_manage_appointments" on appointments;
create policy "admin_manage_appointments"
  on appointments for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ---- customers ----
alter table customers enable row level security;

-- No public policies at all: the public/anon key can neither read nor
-- write this table directly. The customer find-or-create-by-phone upsert
-- in app/api/book/route.js uses the service-role key server-side, which
-- bypasses RLS by design -- that's the one sanctioned way rows get in.
drop policy if exists "admin_manage_customers" on customers;
create policy "admin_manage_customers"
  on customers for all
  to authenticated
  using (is_admin())
  with check (is_admin());

-- ---- admins ----
alter table admins enable row level security;

-- A logged-in user can check whether *they themselves* are an admin
-- (used by the dashboard's auth guard). They cannot see who else is an
-- admin, and cannot insert/update/delete -- admin membership is managed
-- manually via SQL (see the insert example at the bottom of schema.sql).
drop policy if exists "self_check_admin_status" on admins;
create policy "self_check_admin_status"
  on admins for select
  to authenticated
  using (auth.uid() = user_id);
