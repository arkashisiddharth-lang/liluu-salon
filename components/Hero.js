export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container">
        <div className="hero-copy reveal">
          <span className="eyebrow">Premium Beauty Studio · Mumbai</span>
          <h1>Beauty,<br /><em>Refined.</em></h1>
          <p className="sub">A modern beauty studio created for effortless confidence, self-care, and transformation.</p>
          <div className="hero-actions">
            <a href="#booking" className="btn btn-primary">Book an Appointment</a>
            <a href="#services" className="btn btn-outline">Explore Services</a>
          </div>
          <div className="hero-tags">
            <span>Hair</span><span className="dot"></span><span>Skin</span><span className="dot"></span><span>Nails</span><span className="dot"></span><span>Makeup</span>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-1">
          <div className="hero-badge">Rated<b>4.9★</b>500+ Clients</div>
          <div className="frame-main">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
              alt="Stylist finishing a client's hair at LILLU SALON"
              data-fallback="Studio"
            />
          </div>
          <div className="frame-float">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
              alt="Close-up beauty portrait with soft glam makeup"
              data-fallback="Beauty"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
