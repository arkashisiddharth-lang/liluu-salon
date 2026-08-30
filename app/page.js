import { supabase } from '@/lib/supabaseClient';
import Hero from '@/components/Hero';
import GoldThread from '@/components/GoldThread';
import About from '@/components/About';
import Services from '@/components/Services';
import Featured from '@/components/Featured';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Offer from '@/components/Offer';
import Booking from '@/components/Booking';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

// Always fetch fresh data on every request — so a price/service change made
// in the admin dashboard shows up on the homepage immediately, with no
// redeploy or manual cache-clear needed.
export const dynamic = 'force-dynamic';

// Fallback used only if the Supabase fetch fails (e.g. env vars not set yet
// in local dev) — keeps the homepage from breaking during setup. This is
// NOT seed data being re-inserted anywhere; it's purely a rendering fallback.
const FALLBACK_SERVICES = [
  { id: 'fallback-1', name: 'Hair Styling', description: 'Precision cuts and finishing styled to your face and lifestyle.', price: 999 },
  { id: 'fallback-2', name: 'Hair Color', description: 'Global colour, balayage and tone correction using premium formulas.', price: 2499 },
  { id: 'fallback-3', name: 'Signature Facial', description: 'Deep-cleansing, glow-restoring facials tailored to your skin type.', price: 1799 },
  { id: 'fallback-4', name: 'Manicure & Pedicure', description: 'Nail shaping, spa treatment and finishing polish or gel.', price: 1299 },
  { id: 'fallback-5', name: 'Makeup', description: 'Everyday glam to editorial looks, matched to your outfit and event.', price: 3499 },
  { id: 'fallback-6', name: 'Bridal Beauty', description: 'Full bridal beauty experience including hair, makeup and finishing.', price: 15999 },
  { id: 'fallback-7', name: 'Hair Treatments', description: 'Keratin, spa and repair therapies for strength and shine.', price: 1999 },
  { id: 'fallback-8', name: 'Skin Treatments', description: 'Targeted therapies for brightening, hydration and renewal.', price: 2199 },
];

async function getActiveServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, name, category, description, price, duration, image, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[page] Failed to fetch services from Supabase:', error.message);
      return FALLBACK_SERVICES;
    }
    if (!data || data.length === 0) {
      return FALLBACK_SERVICES;
    }
    return data;
  } catch (err) {
    console.error('[page] Unexpected error fetching services:', err);
    return FALLBACK_SERVICES;
  }
}

export default async function HomePage() {
  const services = await getActiveServices();

  return (
    <>
      <Hero />
      <GoldThread />
      <About />
      <GoldThread />
      <Services services={services} />
      <Featured />
      <Gallery />
      <GoldThread />
      <Testimonials />
      <Offer />
      <Booking services={services} />
      <Contact />
      <Footer />
    </>
  );
}
