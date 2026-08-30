export default function About() {
  return (
    <section className="about section-pad" id="about">
      <div className="container">
        <div className="about-visual reveal">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
            alt="LILLU SALON beauty artist working with a client"
            data-fallback="LILLU"
          />
        </div>
        <div className="about-copy reveal reveal-delay-1">
          <span className="eyebrow">About LILLU</span>
          <h2>Your beauty,<br /><em>our craft.</em></h2>
          <p>At LILLU SALON, every appointment is treated as a personal ritual. Our artists blend refined technique with premium, skin-friendly products to create looks that feel entirely your own — never templated, never rushed.</p>
          <p>From a first haircut to full bridal beauty, we design each experience around you: your features, your lifestyle, and the way you want to feel when you walk back out the door.</p>
          <div className="about-stats">
            <div><b>12+</b><span>Expert Artists</span></div>
            <div><b>9 Yrs</b><span>In Beauty Craft</span></div>
            <div><b>4.9★</b><span>Client Rating</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
