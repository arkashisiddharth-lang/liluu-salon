-- ⚠️ REFERENCE ONLY -- DO NOT RUN THIS AGAINST THE LIVE PROJECT.
-- The client has confirmed the `services` table already contains this
-- exact data in their real Supabase project. Running this file again
-- would create 8 duplicate rows (no unique constraint on `name`).
-- Kept here only as a historical record of what the seed data was.
--
-- Seed data for the "services" table
-- Provided by the client. Prices match the demo site exactly:
-- Hair Styling ₹999, Hair Color ₹2,499, Signature Facial ₹1,799,
-- Manicure & Pedicure ₹1,299, Makeup ₹3,499, Bridal Beauty ₹15,999,
-- Hair Treatments ₹1,999, Skin Treatments ₹2,199.
--
-- NOTE: "category" and "duration" are new fields that don't currently appear
-- anywhere on the site's UI. Nothing has been changed on the frontend yet —
-- see the message accompanying this file for what to decide before wiring it up.
--
-- sort_order preserves the exact current homepage order:
-- 1 Hair Styling, 2 Hair Color, 3 Signature Facial, 4 Manicure & Pedicure,
-- 5 Makeup, 6 Bridal Beauty, 7 Hair Treatments, 8 Skin Treatments.

insert into services (name, category, description, price, duration, sort_order, is_active)
values
(
  'Hair Styling',
  'Hair',
  'Precision cuts and finishing styled to your face and lifestyle.',
  999,
  '45-60 min',
  1,
  true
),
(
  'Hair Color',
  'Hair',
  'Global colour, balayage and tone correction using premium formulas.',
  2499,
  '90-120 min',
  2,
  true
),
(
  'Signature Facial',
  'Skin',
  'Deep-cleansing, glow-restoring facials tailored to your skin type.',
  1799,
  '60 min',
  3,
  true
),
(
  'Manicure & Pedicure',
  'Nails',
  'Nail shaping, spa treatment and finishing polish or gel.',
  1299,
  '60-75 min',
  4,
  true
),
(
  'Makeup',
  'Beauty',
  'Everyday glam to editorial looks, matched to your outfit and event.',
  3499,
  '60-90 min',
  5,
  true
),
(
  'Bridal Beauty',
  'Bridal',
  'Full bridal beauty experience including hair, makeup and finishing.',
  15999,
  '3-4 hours',
  6,
  true
),
(
  'Hair Treatments',
  'Hair',
  'Keratin, spa and repair therapies for strength and shine.',
  1999,
  '60-120 min',
  7,
  true
),
(
  'Skin Treatments',
  'Skin',
  'Targeted therapies for brightening, hydration and renewal.',
  2199,
  '60-90 min',
  8,
  true
);
