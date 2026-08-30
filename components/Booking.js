'use client';

import { useEffect, useRef, useState } from 'react';

function formatFriendlyDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
}
function formatFriendlyTime(timeStr) {
  if (!timeStr) return '';
  let [h, min] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(min).padStart(2, '0')} ${ampm}`;
}

export default function Booking({ services }) {
  const formRef = useRef(null);
  const dateInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  // 'form' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmGreeting, setConfirmGreeting] = useState('Thank you!');
  const [confirmDetails, setConfirmDetails] = useState('Your appointment request has been received.');

  // Never allow a past date to be picked (same behaviour as the original site)
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (dateInputRef.current) dateInputRef.current.min = todayStr;
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'submitting') return; // guard against duplicate submissions (double-click, slow network, etc.)

    const form = formRef.current;
    const name = form.bookName.value.trim();
    const phone = form.bookPhone.value.trim();
    const serviceId = form.bookService.value;
    const date = form.bookDate.value;
    const time = form.bookTime.value;

    // Basic phone validation (7-15 digits, may include +, spaces, dashes) — same rule as before
    const phoneClean = phone.replace(/[^0-9]/g, '');
    const phoneValid = phoneClean.length >= 7 && phoneClean.length <= 15;
    if (phoneInputRef.current) {
      phoneInputRef.current.setCustomValidity(phoneValid ? '' : 'Please enter a valid phone number (7–15 digits).');
    }

    if (!form.checkValidity() || !phoneValid) {
      form.classList.add('touched');
      form.reportValidity();
      return;
    }

    const selectedService = services.find((s) => String(s.id) === String(serviceId));

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service_id: serviceId,
          appointment_date: date,
          appointment_time: time,
          notes: '',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Something went wrong on our end — please try again, or message us on WhatsApp.");
        setStatus('error');
        return;
      }

      setConfirmGreeting(`Thank you, ${name.split(' ')[0]}.`);
      setConfirmDetails(
        `Your appointment request for ${selectedService ? selectedService.name : 'your selected service'} on ${formatFriendlyDate(date)} at ${formatFriendlyTime(time)} has been received.`
      );
      setStatus('success');
    } catch (err) {
      setErrorMessage("We couldn't reach the booking system — please check your connection and try again, or message us on WhatsApp.");
      setStatus('error');
    }
  }

  function handleBookAnother() {
    if (formRef.current) {
      formRef.current.reset();
      if (phoneInputRef.current) phoneInputRef.current.setCustomValidity('');
    }
    setErrorMessage('');
    setStatus('form');
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  }

  const showForm = status === 'form' || status === 'submitting' || status === 'error';
  const showConfirm = status === 'success';

  return (
    <section className="booking section-pad" id="booking">
      <div className="container">
        <div className="booking-copy reveal">
          <span className="eyebrow">Book Now</span>
          <h2>Ready for your next<br />transformation?</h2>
          <p>Tell us what you&apos;re after and we&apos;ll confirm your slot. Walk-ins are welcome, but appointments are always given priority.</p>
          <ul className="booking-points">
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>Confirmed within a few hours</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>Free consultation on arrival</li>
            <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg>Reschedule anytime before 24 hrs</li>
          </ul>
          <a
            href="https://wa.me/917045401446?text=Hi%20LILLU%20SALON%2C%20I%27d%20like%20to%20book%20an%20appointment."
            target="_blank"
            rel="noopener"
            className="whatsapp-inline"
          >
            <svg viewBox="0 0 24 24"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.44 1.32 4.94L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91S17.5 2 12.04 2Zm5.79 14.13c-.24.68-1.19 1.25-1.95 1.41-.52.11-1.2.2-3.49-.75-2.93-1.21-4.82-4.16-4.97-4.35-.14-.19-1.19-1.58-1.19-3.02 0-1.44.75-2.14 1.02-2.44.24-.28.55-.36.73-.36h.53c.17 0 .4-.01.62.48.24.55.82 1.9.89 2.04.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.49-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.24 2.22 1.38.28.14.44.12.6-.07.16-.19.68-.79.86-1.07.18-.28.36-.23.6-.14.24.09 1.55.73 1.82.86.27.14.44.2.51.31.07.12.07.68-.17 1.36Z" /></svg>
            Book instantly via WhatsApp
          </a>
        </div>

        <div className="booking-form reveal reveal-delay-1">
          {showForm && (
            <form id="bookingForm" noValidate ref={formRef} onSubmit={handleSubmit} style={{ opacity: status === 'submitting' ? 0.6 : 1, pointerEvents: status === 'submitting' ? 'none' : 'auto' }}>
              <div className="form-row">
                <div className="field full">
                  <label>Full Name</label>
                  <input type="text" name="bookName" id="bookName" placeholder="e.g. Anjali Verma" required />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Phone Number</label>
                  <input type="tel" name="bookPhone" id="bookPhone" ref={phoneInputRef} placeholder="+91 98765 43210" pattern="[0-9+\s-]{7,15}" required />
                </div>
                <div className="field">
                  <label>Service</label>
                  <select name="bookService" id="bookService" required defaultValue="">
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Preferred Date</label>
                  <input type="date" name="bookDate" id="bookDate" ref={dateInputRef} required />
                </div>
                <div className="field">
                  <label>Preferred Time</label>
                  <input type="time" name="bookTime" id="bookTime" required />
                </div>
              </div>

              {status === 'error' && (
                <p style={{ color: '#b5675a', fontSize: '13px', marginBottom: '16px' }}>{errorMessage}</p>
              )}

              <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Sending your request…' : 'Book My Appointment'}
              </button>
            </form>
          )}

          {showConfirm && (
            <div className="form-confirm show" id="formConfirm">
              <div className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 13l4 4L19 7" /></svg></div>
              <h3 id="confirmGreeting">{confirmGreeting}</h3>
              <p id="confirmDetails">{confirmDetails}</p>
              <p className="confirm-disclaimer">Your request has been sent to the salon and is pending confirmation.</p>
              <button type="button" className="btn btn-outline" id="bookAnotherBtn" onClick={handleBookAnother}>
                Book Another Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
