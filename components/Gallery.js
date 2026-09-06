const GALLERY_ITEMS = [
  { cls: 'g1', src: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1000&q=80', alt: 'Hair transformation', fallback: 'Hair', tag: 'Hair Transformation', delay: '' },
  { cls: 'g2', src: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=700&q=80', alt: 'Makeup artistry', fallback: 'Makeup', tag: 'Makeup Artistry', delay: 'reveal-delay-1' },
  { cls: 'g3', src: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=700&q=80', alt: 'Nail art', fallback: 'Nails', tag: 'Nail Art', delay: 'reveal-delay-2' },
  { cls: 'g4', src: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=700&q=80', alt: 'Facial treatment', fallback: 'Facial', tag: 'Facial Treatment', delay: '' },
  { cls: 'g5', src: 'https://images.unsplash.com/photo-1522336284037-91f7da073525?auto=format&fit=crop&w=700&q=80', alt: 'Salon interior', fallback: 'Studio', tag: 'Salon Interior', delay: 'reveal-delay-1' },
  { cls: 'g6', src: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?auto=format&fit=crop&w=700&q=80', alt: 'Bridal beauty look', fallback: 'Bridal', tag: 'Bridal Look', delay: 'reveal-delay-2' },
];

export default function Gallery() {
  return (
    <section className="gallery section-pad" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Portfolio</span>
          <h2>Moments from<br />the studio.</h2>
        </div>
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.cls}
              className={`gallery-item ${item.cls} reveal ${item.delay}`}
              tabIndex={0}
              role="button"
              aria-label={`View ${item.tag} image`}
            >
              <img src={item.src} alt={item.alt} data-fallback={item.fallback} />
              <span className="tag">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
