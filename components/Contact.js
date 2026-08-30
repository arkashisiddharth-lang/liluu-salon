export default function Contact() {
  return (
    <section className="contact section-pad" id="contact">
      <div className="container">
        <div className="contact-info reveal">
          <span className="eyebrow">Visit Us</span>
          <h2>LILLU SALON</h2>
          <div className="contact-block">
            <h4>Address</h4>
            <p>3rd Floor, Sunrise Arcade, Linking Road<br />Bandra West, Mumbai, Maharashtra 400050</p>
          </div>
          <div className="contact-block">
            <h4>Studio Hours</h4>
            <p>Mon – Sun: 10:00 AM – 8:00 PM</p>
          </div>
          <div className="contact-block">
            <h4>Contact</h4>
            <p>
              <a href="tel:+917045401446">+91 70454 01446</a><br />
              <a href="mailto:K2salon23@gmail.com">K2salon23@gmail.com</a>
            </p>
          </div>
        </div>
        <div className="map-col reveal reveal-delay-1">
          <div className="map-wrap">
            <span className="map-label">LILLU SALON · Location</span>
            <iframe
              src="https://www.google.com/maps?q=19.0550904,72.9094615&z=17&output=embed"
              loading="lazy"
              title="LILLU SALON location on Google Maps"
            ></iframe>
          </div>
          <a href="https://maps.app.goo.gl/2rLWdMA1UQsdUJ3e6" target="_blank" rel="noopener" className="btn btn-outline">
            Get Directions
          </a>
        </div>
      </div>
    </section>
  );
}
