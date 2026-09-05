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

        {/* Demo Project Card */}
        <div className="demo-project-card reveal reveal-delay-1">
          <div className="demo-project-visual">
            <div className="demo-project-browser">
              <div className="demo-browser-header">
                <div className="demo-browser-dots">
                  <span></span><span></span><span></span>
                </div>
                <div className="demo-browser-url">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>liluu-salon.vercel.app</span>
                </div>
                <span className="demo-live-badge">
                  <span className="demo-live-pulse"></span>
                  Live Demo
                </span>
              </div>
              <a
                href="https://liluu-salon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-preview-link"
                aria-label="Visit LILLU SALON live website"
              >
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                  alt="LILLU SALON Live Website Preview"
                  data-fallback="LILLU SALON"
                />
                <div className="demo-preview-overlay">
                  <span className="demo-overlay-btn">
                    <span>View Live Website</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7"></line>
                      <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="demo-project-content">
            <div className="demo-project-header">
              <span className="demo-project-label">Demo Project</span>
              <span className="demo-project-chip">Full Concept</span>
            </div>
            <h3 className="demo-project-title">LILLU SALON</h3>
            <p className="demo-project-desc">
              A modern, premium salon website concept designed to showcase services, portfolio, testimonials, and appointment booking.
            </p>
            <div className="demo-project-highlights">
              <div className="demo-highlight-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Curated Services &amp; Pricing Suite</span>
              </div>
              <div className="demo-highlight-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Interactive Booking &amp; Client Workflow</span>
              </div>
              <div className="demo-highlight-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Editorial Studio Aesthetic &amp; Mobile-First UX</span>
              </div>
            </div>
            <div className="demo-project-actions">
              <a
                href="https://liluu-salon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold demo-cta-btn"
              >
                <span>View Live</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
              <a
                href="https://liluu-salon.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="demo-url-link"
              >
                liluu-salon.vercel.app
              </a>
            </div>
          </div>
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
