import ServiceIcon from './ServiceIcon';

// Static "also available" chips — these are extra menu items, not part of
// the services table, and were already static content in the original site.
const EXTRA_CHIPS = [
  'Threading & Waxing',
  'Hair Spa & Scalp Therapy',
  'Party Makeup',
  'Nail Extensions',
  "Kids' Haircuts",
  'Head Massage',
];

const REVEAL_DELAYS = ['', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3'];

export default function Services({ services }) {
  return (
    <section className="services section-pad" id="services">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Our Services</span>
          <h2>Crafted for every kind<br />of transformation.</h2>
        </div>
        <div className="service-grid">
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`service-card reveal ${REVEAL_DELAYS[i % 4]}`}
              data-service-id={service.id}
              data-service-name={service.name}
              tabIndex={0}
              role="button"
              aria-label={`Book ${service.name}`}
            >
              <div className="icon"><ServiceIcon name={service.name} /></div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="price">
                Starting from<b>₹{Number(service.price).toLocaleString('en-IN')}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta reveal">
          <button type="button" className="btn btn-outline" id="viewAllBtn" aria-expanded="false">
            View All Services
          </button>
        </div>
        <div className="service-more" id="serviceMore">
          <div className="service-more-inner">
            <h4>Also available at LILLU</h4>
            <div className="chip-row">
              {EXTRA_CHIPS.map((chip) => (
                <span className="chip" key={chip}>{chip}</span>
              ))}
            </div>
            <p className="service-more-note">Ask our team for a personalised recommendation during your consultation.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
