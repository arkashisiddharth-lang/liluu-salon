const TESTIMONIALS = [
  { initial: 'A', name: 'Ananya Sharma', place: 'Bandra, Mumbai', quote: 'The entire experience felt luxurious from start to finish. The attention to detail was incredible.', delay: '' },
  { initial: 'R', name: 'Ritika Malhotra', place: 'Powai, Mumbai', quote: 'My bridal trial was flawless. The team listened, adjusted, and made me feel completely at ease.', delay: 'reveal-delay-1' },
  { initial: 'P', name: 'Priya Nair', place: 'Andheri, Mumbai', quote: "Best facial I've had in the city. My skin genuinely looked different by the time I left.", delay: 'reveal-delay-2' },
  { initial: 'K', name: 'Kavya Reddy', place: 'Worli, Mumbai', quote: 'Booking was effortless and the studio itself feels like a five-star retreat. Worth every rupee.', delay: 'reveal-delay-3' },
];

export default function Testimonials() {
  return (
    <section className="testimonials section-pad">
      <div className="container">
        <div className="section-head center reveal">
          <span className="eyebrow">Client Stories</span>
          <h2>Loved by the<br />faces we work with.</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div className={`testi-card reveal ${t.delay}`} key={t.name}>
              <div className="stars">★★★★★</div>
              <p className="quote">&quot;{t.quote}&quot;</p>
              <div className="who">
                <div className="avatar">{t.initial}</div>
                <div><b>{t.name}</b><span>{t.place}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
