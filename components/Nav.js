export default function Nav() {
  return (
    <nav className="nav" id="nav">
      <div className="container">
        <a href="#home" className="logo">
          <span className="mark">LILLU</span>
          <span className="sub">Salon</span>
        </a>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="nav-cta">
          <a href="#booking" className="btn btn-gold btn-sm" style={{ display: 'none' }} id="navBookDesktop">
            Book Now
          </a>
          <a href="#booking" className="btn btn-primary btn-sm">Book Appointment</a>
          <button className="nav-toggle" id="navToggle" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}
