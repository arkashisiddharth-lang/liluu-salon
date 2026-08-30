export default function Featured() {
  return (
    <section className="featured section-pad">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">The LILLU Experience</span>
          <h2>Three crafts,<br />one studio.</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-item reveal" data-related="Hair Styling,Hair Color,Hair Treatments" tabIndex={0} role="button" aria-label="See Hair services">
            <div className="fig">
              <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80" alt="Hair styling at LILLU SALON" data-fallback="Hair" />
            </div>
            <h3>Hair</h3>
            <p>Signature cuts, styling & transformations.</p>
          </div>
          <div className="feature-item reveal reveal-delay-1" data-related="Signature Facial,Skin Treatments" tabIndex={0} role="button" aria-label="See Skin services">
            <div className="fig">
              <img src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=700&q=80" alt="Skin facial treatment at LILLU SALON" data-fallback="Skin" />
            </div>
            <h3>Skin</h3>
            <p>Glow-focused facials and treatments.</p>
          </div>
          <div className="feature-item reveal reveal-delay-2" data-related="Makeup,Manicure & Pedicure,Bridal Beauty" tabIndex={0} role="button" aria-label="See Beauty services">
            <div className="fig">
              <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80" alt="Makeup and nail finishing at LILLU SALON" data-fallback="Beauty" />
            </div>
            <h3>Beauty</h3>
            <p>Makeup, nails & finishing touches.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
