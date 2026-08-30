import 'server-only';
import { createClient } from '@supabase/supabase-js';

// SECURITY: this file must NEVER be imported from a 'use client' component,
// or from any file that ends up in the browser bundle. The `server-only`
// import above makes Next.js throw a build error if that ever happens.
//
// This client uses SUPABASE_SERVICE_ROLE_KEY, which bypasses Row Level
// Security entirely. It exists only so that trusted server code (Next.js
// Route Handlers under app/api/**) can do privileged operations like the
// customer find-or-create-by-phone upsert, which public/anon RLS policies
// intentionally do not allow (see supabase/policies.sql).
//
// It is only ever used inside app/api/book/route.js.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[supabaseAdmin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
    'Set them in .env.local (server-only, no NEXT_PUBLIC_ prefix on the service key).'
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
