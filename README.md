# LILLU SALON — Next.js + Supabase

## What this is

The homepage is a byte-for-byte visual port of the original single-file HTML
site into Next.js (App Router, JavaScript). Same colors, fonts, spacing,
images, animations, section order — nothing was redesigned.

On top of that, this step wires up:
- Services fetched live from Supabase (`is_active = true`, ordered by `sort_order`)
- Real booking submissions → `appointments` table (status always starts `pending`)
- Customer find-or-create by phone → `customers` table
- Email notification to the salon owner on new bookings (Resend)
- `/admin/login` + `/admin` dashboard (appointments, customers, services management)
- Row Level Security policies with a proper `admins` role table (not "every logged-in user is an admin")

## ⚠️ What I could NOT test myself, and why

I built and reviewed this code carefully, but I'm working in a sandboxed
environment with **no internet access** and **no real credentials** for your
project. Concretely, I could not:

- Run `npm install` against the real npm registry
- Run `next dev` and click through the live site
- Connect to your actual Supabase project or run the SQL against it
- Send a real test email through Resend
- Confirm a row actually lands in `appointments`/`customers` in your database

So section 20 of your brief ("test everything") — I could not do that part
myself. **You'll need to run those checks locally** once you plug in real
credentials, using the steps below. I'd rather tell you this plainly than
claim a live flow was verified when it wasn't.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page, **service_role** key (server-only, never exposed to the browser)
   - `RESEND_API_KEY`, `SALON_NOTIFICATION_EMAIL`, `RESEND_FROM_EMAIL` — from resend.com, once you've created an account and (ideally) verified a sending domain
3. In the Supabase SQL Editor, run `supabase/schema.sql` — it only *adds* the
   new `admins` table and a `customers.phone` unique constraint; it will not
   touch or duplicate your existing `services`/`appointments`/`customers` data.
4. Run `supabase/policies.sql` — this defines the RLS policies, including the
   `is_admin()` helper. It uses `drop policy if exists` so it's safe to
   re-run, but review it first if you already have policies you want to keep
   exactly as-is.
5. Create your admin user: Supabase Dashboard → Authentication → Users → Add user
   (email/password). Then in the SQL Editor:
   ```sql
   insert into admins (user_id, name) values ('<that user's UUID>', 'Owner');
   ```
6. `npm run dev`, then open `http://localhost:3000`.

## Testing checklist (please run this yourself)

- [ ] Homepage loads, looks identical to the original
- [ ] Service cards show your real Supabase services/prices, in the right order
- [ ] Clicking a service card selects it in the booking form and scrolls down
- [ ] Submit a real test booking → check it appears in Supabase `appointments` with `status = 'pending'`
- [ ] Check a `customers` row was created/updated, matched by phone
- [ ] Check your inbox for the new-appointment email (if Resend env vars are set)
- [ ] Try booking with a past date — should be blocked
- [ ] Visit `/admin` while logged out → should redirect to `/admin/login`
- [ ] Log in with your admin user → dashboard stats load
- [ ] Confirm / complete / cancel / delete an appointment from `/admin/appointments`
- [ ] Edit a service price in `/admin/services` → refresh the homepage → price updates
- [ ] Check mobile responsiveness on the homepage and `/admin`

## Known simplifications (flagged per your instructions, not silently done)

- **Image upload**: services store an `image` URL field, editable from
  `/admin/services`. Actual file upload to Supabase Storage isn't wired up —
  per your instruction #12, I kept existing image URLs working and left the
  structure ready, rather than guessing at a Storage bucket configuration I
  couldn't test.
- **Booking confirmation copy**: the original demo said *"This is a demo
  booking — no real appointment has been created."* Since a real appointment
  now IS created, I changed this line to *"Your request has been sent to the
  salon and is pending confirmation."* This is a small content change beyond
  pure functionality — flagging it explicitly rather than leaving inaccurate
  copy in place.
- **Public booking path**: bookings go through `app/api/book/route.js` using
  the service-role key server-side (never exposed to the browser), rather
  than inserting directly from the browser with the anon key. This was the
  only safe way to do the customer-by-phone upsert without exposing customer
  records to public reads.
