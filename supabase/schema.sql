-- =====================================================================
-- This file documents the EXISTING schema as described by the client:
-- services, appointments, customers already exist in their Supabase
-- project with existing data and existing RLS. Every statement below
-- uses IF NOT EXISTS / safe guards, so running this file against the
-- real project will NOT recreate, duplicate, or wipe anything -- it only
-- adds the one new thing this step actually needs: an `admins` table for
-- the dashboard's role-based authorization (see policies.sql).
-- =====================================================================

-- ---- services (existing table, documented for reference) ----
create table if not exists services (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  description text,
  price       integer not null,
  duration    text,
  image       text,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ---- appointments (existing table, documented for reference) ----
create table if not exists appointments (
  id                 uuid primary key default gen_random_uuid(),
  customer_name      text not null,
  phone              text not null,
  email              text,
  service_id         uuid references services (id),
  appointment_date   date not null,
  appointment_time   time not null,
  notes              text,
  status             text not null default 'pending'
                       check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at         timestamptz not null default now()
);

-- ---- customers (existing table, documented for reference) ----
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  email       text,
  created_at  timestamptz not null default now()
);

-- Needed so /api/book can safely upsert-by-phone without creating duplicates.
-- Safe to run even if it already exists.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'customers_phone_key'
  ) then
    alter table customers add constraint customers_phone_key unique (phone);
  end if;
end $$;

-- =====================================================================
-- NEW: admins table -- the role/profile mechanism used to authorize the
-- dashboard (see policies.sql). A row here = that auth user is an admin.
-- Nothing public can read, write, or discover this table (see policies.sql).
-- =====================================================================
create table if not exists admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  name        text,
  created_at  timestamptz not null default now()
);

-- To make your first admin user, after creating them in
-- Supabase Auth (Dashboard -> Authentication -> Users -> Add user),
-- run (replacing the UUID with that user's id):
--
--   insert into admins (user_id, name) values ('00000000-0000-0000-0000-000000000000', 'Owner');
