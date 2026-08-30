// ---- Nav scroll state ----
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ---- Mobile menu ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }));
}

// ---- Scroll reveal ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .thread').forEach((el) => io.observe(el));

// ---- Service cards: select in booking form + scroll to booking ----
const serviceCards = document.querySelectorAll('.service-card[data-service-id]');
function scrollToBooking() {
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
}
function chooseService(card) {
  serviceCards.forEach((c) => c.classList.remove('is-selected'));
  card.classList.add('is-selected');
  const select = document.getElementById('bookService');
  if (select) {
    select.value = card.dataset.serviceId;
    // Booking.js is an uncontrolled <select> (no value/onChange prop bound
    // by React), so setting .value directly here is safe and matches how
    // this worked before the Supabase conversion.
  }
  scrollToBooking();
}
serviceCards.forEach((card) => {
  card.addEventListener('click', () => chooseService(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chooseService(card); }
  });
});

// ---- View All Services: expand / collapse extra info ----
const viewAllBtn = document.getElementById('viewAllBtn');
const serviceMore = document.getElementById('serviceMore');
if (viewAllBtn && serviceMore) {
  viewAllBtn.addEventListener('click', () => {
    const expanded = serviceMore.classList.toggle('expanded');
    viewAllBtn.textContent = expanded ? 'Show Less' : 'View All Services';
    viewAllBtn.setAttribute('aria-expanded', expanded);
    if (expanded) { serviceMore.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  });
}

// ---- Featured Experience: scroll to related services and pulse them ----
const featureItems = document.querySelectorAll('.feature-item[data-related]');
featureItems.forEach((item) => {
  const goToRelated = () => {
    const related = item.dataset.related.split(',');
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    serviceCards.forEach((card) => {
      if (related.includes(card.dataset.serviceName)) {
        card.classList.remove('pulse'); void card.offsetWidth; // restart animation
        card.classList.add('pulse');
        setTimeout(() => card.classList.remove('pulse'), 2200);
      }
    });
  };
  item.addEventListener('click', goToRelated);
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToRelated(); }
  });
});

// ---- Gallery lightbox ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(imgEl, caption) {
  const fullSrc = imgEl.src.includes('images.unsplash.com') ? imgEl.src.replace(/w=\d+/, 'w=1600') : imgEl.src;
  lightboxImg.onerror = () => phFallback(lightboxImg, caption || 'LILLU');
  lightboxImg.src = fullSrc;
  lightboxImg.alt = imgEl.alt;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}
if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll('.gallery-item').forEach((item) => {
    const img = item.querySelector('img');
    const tagEl = item.querySelector('.tag');
    const trigger = () => openLightbox(img, tagEl ? tagEl.textContent : '');
    item.addEventListener('click', trigger);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) { closeLightbox(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox.classList.contains('open')) { closeLightbox(); } });
}

// ---- Elegant fallback for any image that fails to load ----
function phFallback(img, label) {
  img.onerror = null;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%23F1D8D1'/><stop offset='100%' stop-color='%23E3C79C'/>
    </linearGradient></defs>
    <rect width='400' height='500' fill='url(%23g)'/>
    <rect x='16' y='16' width='368' height='468' fill='none' stroke='%23AD8A4E' stroke-width='1.5'/>
    <text x='200' y='250' font-family='Georgia,serif' font-size='30' fill='%233A2B22' text-anchor='middle' font-style='italic'>LILLU SALON</text>
    <text x='200' y='280' font-family='Arial,sans-serif' font-size='12' letter-spacing='3' fill='%236B5647' text-anchor='middle'>${label.toUpperCase()}</text>
  </svg>`;
  img.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Wire up onerror for every image marked with data-fallback (used instead of
// inline onerror="" attributes, since those aren't usable from React/JSX).
document.querySelectorAll('img[data-fallback]').forEach((img) => {
  img.addEventListener('error', () => phFallback(img, img.dataset.fallback), { once: true });
});
