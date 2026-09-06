export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-orb hero-orb-a" aria-hidden="true" />
      <div className="hero-orb hero-orb-b" aria-hidden="true" />
      <div className="hero-noise" aria-hidden="true" />
      <div className="container">
        <div className="hero-copy reveal">
          <div className="hero-kicker"><span className="hero-kicker-dot" /> Mumbai's refined beauty destination</div>
          <span className="eyebrow">Premium Beauty Studio · Mumbai</span>
          <h1>Beauty,<br /><em>Refined.</em></h1>
          <p className="sub">A modern beauty studio created for effortless confidence, self-care, and transformation.</p>
          <div className="hero-actions">
            <a href="#booking" className="btn btn-primary">Book an Appointment <span className="btn-arrow">↗</span></a>
            <a href="#services" className="btn btn-outline">Explore Services <span className="btn-arrow">↓</span></a>
          </div>
          <div className="hero-tags">
            <span>Hair</span><span className="dot" /><span>Skin</span><span className="dot" /><span>Nails</span><span className="dot" /><span>Makeup</span>
          </div>
          <div className="hero-trust">
            <div className="trust-avatars"><span>R</span><span>A</span><span>S</span><span>+</span></div>
            <div><strong>Loved by 500+ clients</strong><small>4.9/5 average experience</small></div>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-1">
          <div className="hero-badge"><span>EST.</span><b>2017</b><small>LILLU SALON</small></div>
          <div className="hero-image-glow" aria-hidden="true" />
          <div className="frame-main">
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" alt="Stylist finishing a client's hair at LILLU SALON" data-fallback="Studio" />
            <div className="image-overlay"><span>THE LILLU EXPERIENCE</span><i /></div>
          </div>
          <div className="frame-float">
            <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80" alt="Close-up beauty portrait with soft glam makeup" data-fallback="Beauty" />
          </div>
          <div className="hero-mini-card"><span className="mini-icon">✦</span><div><strong>Personalised</strong><small>Beauty rituals, made for you</small></div></div>
        </div>
      </div>
      <div className="hero-scroll"><span>Scroll to discover</span><i /></div>
    </section>
  );
}
