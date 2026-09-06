'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import './chatbot.css';

// Real salon info, copied verbatim from Contact.js / Footer.js / WhatsAppFloat.js
// so the chatbot never invents anything that isn't already on the site.
const SALON = {
  name: 'LILLU SALON',
  hoursLine: 'Mon – Sun: 10:00 AM – 8:00 PM',
  phoneDisplay: '+91 70454 01446',
  whatsappNumber: '917045401446',
  email: 'K2salon23@gmail.com',
};

// Mirrors the FALLBACK_SERVICES list in app/page.js. Duplicated on purpose
// rather than importing from page.js, so this new component doesn't require
// modifying that existing file. If Supabase is reachable, this is replaced
// with the live, real service list on mount (see useEffect below).
const FALLBACK_SERVICES = [
  { id: 'fallback-1', name: 'Hair Styling', price: 999 },
  { id: 'fallback-2', name: 'Hair Color', price: 2499 },
  { id: 'fallback-3', name: 'Signature Facial', price: 1799 },
  { id: 'fallback-4', name: 'Manicure & Pedicure', price: 1299 },
  { id: 'fallback-5', name: 'Makeup', price: 3499 },
  { id: 'fallback-6', name: 'Bridal Beauty', price: 15999 },
  { id: 'fallback-7', name: 'Hair Treatments', price: 1999 },
  { id: 'fallback-8', name: 'Skin Treatments', price: 2199 },
];

const QUICK_ACTIONS = [
  { id: 'book', label: 'Book an appointment' },
  { id: 'services', label: 'View services' },
  { id: 'prices', label: 'Prices' },
  { id: 'hours', label: 'Opening hours' },
];

function formatPrice(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

function servicesListText(services) {
  const lines = services.map((s) => `• ${s.name}`).join('\n');
  return `Of course! Here are our available salon services:\n\n${lines}\n\nWant pricing for any of these? Just tap "Prices" below.`;
}

function pricesListText(services) {
  const lines = services.map((s) => `${s.name} — ${formatPrice(s.price)}`).join('\n');
  return `Here are our current starting prices:\n\n${lines}\n\nFinal pricing may vary slightly based on length/complexity — our team will confirm at consultation.`;
}

function hoursText() {
  return `We're open:\n${SALON.hoursLine} ✨`;
}

function bookingText() {
  return `Wonderful! I'll take you straight to our booking form — just fill in your details and we'll confirm shortly.`;
}

function fallbackText() {
  return "I'm still learning 😊 Please choose one of the options below, or contact our salon team for assistance.";
}

function contactText() {
  return `You can reach ${SALON.name} directly:\n\n📞 ${SALON.phoneDisplay}\n✉️ ${SALON.email}\n💬 WhatsApp us anytime — the button is in the bottom right.`;
}

function matchIntent(raw) {
  const text = raw.toLowerCase();
  if (/\b(hi|hello|hey)\b/.test(text)) return 'greeting';
  if (/(timing|hours|open|close|when.*open)/.test(text)) return 'hours';
  if (/(price|cost|rate|charge|how much)/.test(text)) return 'price_pointer';
  if (/(service|services|menu|treatment)/.test(text)) return 'services';
  if (/(book|appointment|booking|schedule|reserve)/.test(text)) return 'book';
  if (/(contact|phone|number|whatsapp|address|location|email)/.test(text)) return 'contact';
  return null;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [messages, setMessages] = useState(() => [
    {
      id: nextId(),
      role: 'bot',
      text: 'Hi! 👋\nWelcome to Lillu Salon.\nHow can I help you today?',
      time: nowTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Load live active services if Supabase is reachable — same public,
  // already-existing read used elsewhere in the app (Services/Booking).
  // Falls back silently to the static list above if not.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, price')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!cancelled && !error && data && data.length > 0) {
          setServices(data);
        }
      } catch {
        // keep fallback silently — chatbot must never break because of this
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Scroll to latest message whenever the conversation grows
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Escape key closes the panel; focus the input when it opens
  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      clearTimeout(t);
    };
  }, [isOpen]);

  function pushMessage(msg) {
    setMessages((prev) => [...prev, { id: nextId(), time: nowTime(), ...msg }]);
  }

  function respondTo(intentId) {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      switch (intentId) {
        case 'book':
          pushMessage({ role: 'bot', text: bookingText(), cta: 'booking' });
          break;
        case 'services':
          pushMessage({ role: 'bot', text: servicesListText(services) });
          break;
        case 'prices':
          pushMessage({ role: 'bot', text: pricesListText(services) });
          break;
        case 'hours':
          pushMessage({ role: 'bot', text: hoursText() });
          break;
        case 'price_pointer':
          pushMessage({ role: 'bot', text: "Please check our current service prices above, or choose 'Prices' to see the available options." });
          break;
        case 'contact':
          pushMessage({ role: 'bot', text: contactText() });
          break;
        case 'greeting':
          pushMessage({ role: 'bot', text: 'Hi there! 👋 How can I help — booking, services, prices, or opening hours?' });
          break;
        default:
          pushMessage({ role: 'bot', text: fallbackText() });
      }
    }, 450);
  }

  function handleQuickAction(action) {
    pushMessage({ role: 'user', text: action.label });
    respondTo(action.id);
  }

  function handleSend(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    pushMessage({ role: 'user', text: trimmed });
    setInputValue('');
    const intent = matchIntent(trimmed);
    respondTo(intent || 'fallback');
  }

  function goToBooking() {
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  // Chatbot is for the customer-facing site only — never on /admin.
  if (pathname && pathname.startsWith('/admin')) return null;

  return (
    <>
      <button
        type="button"
        className="chatbot-fab"
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" /></svg>
        )}
      </button>

      <div
        className={`chatbot-panel ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-label="Lillu Salon chat assistant"
        aria-hidden={!isOpen}
        ref={panelRef}
      >
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <span className="chatbot-title">✨ Lillu Assistant</span>
            <span className="chatbot-status"><span className="chatbot-dot"></span>Online</span>
          </div>
          <button type="button" className="chatbot-close" aria-label="Close chat" onClick={() => setIsOpen(false)}>
            &times;
          </button>
        </div>

        <div className="chatbot-messages" ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`chatbot-msg-row ${m.role === 'user' ? 'from-user' : 'from-bot'}`}>
              <div className="chatbot-bubble">
                {m.text.split('\n').map((line, i) => (
                  <span key={i} className="chatbot-line">{line}</span>
                ))}
                {m.cta === 'booking' && (
                  <button type="button" className="chatbot-cta-btn" onClick={goToBooking}>
                    Go to booking form
                  </button>
                )}
              </div>
              <span className="chatbot-time">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="chatbot-msg-row from-bot">
              <div className="chatbot-bubble chatbot-typing" aria-label="Assistant is typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-quick-actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className="chatbot-quick-btn"
              onClick={() => handleQuickAction(action)}
            >
              {action.label}
            </button>
          ))}
        </div>

        <form className="chatbot-input-row" onSubmit={handleSend}>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            aria-label="Type your message"
          />
          <button type="submit" className="chatbot-send-btn" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>
          </button>
        </form>
      </div>
    </>
  );
}
