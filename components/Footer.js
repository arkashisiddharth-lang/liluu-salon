export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="mark">LILLU SALON</div>
            <p>A modern beauty studio for hair, skin, nails and makeup — crafted for effortless confidence.</p>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#booking">Book Now</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Services</h5>
            <ul>
              <li><a href="#services">Hair & Color</a></li>
              <li><a href="#services">Skin & Facials</a></li>
              <li><a href="#services">Nails</a></li>
              <li><a href="#services">Bridal Beauty</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Studio</h5>
            <p>Linking Road, Bandra West<br />Mumbai, Maharashtra</p>
            <p style={{ marginTop: '10px' }}>+91 70454 01446</p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 LILLU SALON. All rights reserved.</span>
          <span className="credit">Website concept by <span style={{ color: 'var(--gold-light)' }}>Weblixflow</span></span>
        </div>
      </div>
    </footer>
  );
}
