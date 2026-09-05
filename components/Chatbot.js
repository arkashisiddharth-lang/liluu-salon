'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const SALON_SERVICES = [
  { id: 'hair-styling', name: 'Hair Styling', price: 999, category: 'Hair', desc: 'Precision cuts and finishing styled to your face and lifestyle.' },
  { id: 'hair-color', name: 'Hair Color', price: 2499, category: 'Hair', desc: 'Global colour, balayage and tone correction using premium formulas.' },
  { id: 'facial', name: 'Signature Facial', price: 1799, category: 'Skin', desc: 'Deep-cleansing, glow-restoring facials tailored to your skin type.' },
  { id: 'mani-pedi', name: 'Manicure & Pedicure', price: 1299, category: 'Nails', desc: 'Nail shaping, spa treatment and finishing polish or gel.' },
  { id: 'makeup', name: 'Makeup', price: 3499, category: 'Beauty', desc: 'Everyday glam to editorial looks, matched to your outfit and event.' },
  { id: 'bridal', name: 'Bridal Beauty', price: 15999, category: 'Bridal', desc: 'Full bridal beauty experience including hair, makeup and finishing.' },
  { id: 'hair-treatments', name: 'Hair Treatments', price: 1999, category: 'Hair', desc: 'Keratin, spa and repair therapies for strength and shine.' },
  { id: 'skin-treatments', name: 'Skin Treatments', price: 2199, category: 'Skin', desc: 'Targeted therapies for brightening, hydration and renewal.' },
];

const EXTRA_SERVICES = [
  'Threading & Waxing',
  'Hair Spa & Scalp Therapy',
  'Party Makeup',
  'Nail Extensions',
  "Kids' Haircuts",
  'Head Massage',
];

const QUICK_ACTIONS = [
  { id: 'book', label: 'Book an appointment', icon: '📅' },
  { id: 'services', label: 'View services', icon: '✨' },
  { id: 'prices', label: 'Prices', icon: '💎' },
  { id: 'hours', label: 'Opening hours', icon: '⏰' },
];

function getTimeString() {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hi! 👋\nWelcome to Lillu Salon.\nHow can I help you today?',
      time: getTimeString(),
      showQuickActions: true,
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll chat to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setHasOpenedBefore(true);
      setUnreadCount(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Do not display chatbot on admin routes to prevent interface clutter
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  function handleScrollToBooking(serviceName = null) {
    setIsOpen(false);
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      
      // If a specific service was mentioned, select it in the dropdown if available
      if (serviceName) {
        const select = document.getElementById('bookService');
        if (select) {
          const options = Array.from(select.options);
          const match = options.find((opt) => opt.text.toLowerCase().includes(serviceName.toLowerCase()));
          if (match) {
            select.value = match.value;
          }
        }
      }
      
      // Focus the name input
      setTimeout(() => {
        const nameInput = document.getElementById('bookName');
        nameInput?.focus();
      }, 600);
    }
  }

  function generateResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. TIMING / OPENING HOURS
    if (
      q.includes('hour') ||
      q.includes('time') ||
      q.includes('timing') ||
      q.includes('open') ||
      q.includes('close') ||
      q.includes('when') ||
      q.includes('sunday') ||
      q.includes('monday') ||
      q.includes('schedule')
    ) {
      return {
        text: "We're open from 10:00 AM to 8:00 PM, Monday through Sunday! ✨\n\nWalk-ins are warmly welcome, but appointments are prioritized to ensure zero waiting time.",
        actions: [
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
          { label: '📍 View Studio Location', actionType: 'location' },
        ],
      };
    }

    // 2. SPECIFIC SERVICE PRICING OR DETAILS
    if (q.includes('haircut') || q.includes('hair cut') || q.includes('hair style') || q.includes('hair styling')) {
      return {
        text: '💇‍♀️ Hair Styling starts from ₹999.\n\nIncludes precision cut, consultation, shampoo, and finishing styled to your face and lifestyle.',
        actions: [
          { label: 'Book Hair Styling', onClick: () => handleScrollToBooking('Hair Styling') },
          { label: 'View All Prices', actionType: 'prices' },
        ],
      };
    }

    if (q.includes('color') || q.includes('colour') || q.includes('balayage') || q.includes('highlights') || q.includes('global')) {
      return {
        text: '🎨 Hair Color & Balayage starts from ₹2,499.\n\nWe offer global colour, bespoke balayage, toner correction, and highlights using gentle, high-grade formulas.',
        actions: [
          { label: 'Book Hair Color', onClick: () => handleScrollToBooking('Hair Color') },
          { label: 'View All Prices', actionType: 'prices' },
        ],
      };
    }

    if (q.includes('facial') || q.includes('clean up') || q.includes('cleanup') || q.includes('glow')) {
      return {
        text: '✨ Signature Facials start from ₹1,799.\n\nDeep-cleansing, pore-refining, and glow-restoring skin therapies personalized to your skin type.',
        actions: [
          { label: 'Book a Facial', onClick: () => handleScrollToBooking('Signature Facial') },
          { label: 'View Skin Services', actionType: 'services' },
        ],
      };
    }

    if (q.includes('manicure') || q.includes('pedicure') || q.includes('mani') || q.includes('pedi') || q.includes('nail')) {
      return {
        text: '💅 Manicure & Pedicure starts from ₹1,299.\n\nIncludes nail shaping, cuticle therapy, rejuvenating massage, and finishing polish or gel. We also offer custom Nail Extensions!',
        actions: [
          { label: 'Book Mani / Pedi', onClick: () => handleScrollToBooking('Manicure & Pedicure') },
          { label: 'View All Services', actionType: 'services' },
        ],
      };
    }

    if (q.includes('bridal') || q.includes('wedding') || q.includes('bride')) {
      return {
        text: '👰 Bridal Beauty Packages start from ₹15,999.\n\nA complete luxury bridal experience including custom hair styling, bridal makeup, pre-bridal care, saree/dupatta draping, and finishing.',
        actions: [
          { label: 'Book Bridal Consultation', onClick: () => handleScrollToBooking('Bridal Beauty') },
          { label: 'Chat on WhatsApp', isWhatsApp: true },
        ],
      };
    }

    if (q.includes('makeup') || q.includes('glam')) {
      return {
        text: '💄 Makeup services start from ₹3,499.\n\nFrom effortless party glam to high-definition photoshoot & editorial looks, tailored to your outfit and theme.',
        actions: [
          { label: 'Book Makeup', onClick: () => handleScrollToBooking('Makeup') },
          { label: 'View All Prices', actionType: 'prices' },
        ],
      };
    }

    if (q.includes('keratin') || q.includes('spa') || q.includes('treatment') || q.includes('botox') || q.includes('hair treatment')) {
      return {
        text: '🌿 Hair & Scalp Treatments start from ₹1,999.\n\nDeep conditioning hair spa, keratin infusion, scalp detox, and intensive bond repair therapies.',
        actions: [
          { label: 'Book Hair Treatment', onClick: () => handleScrollToBooking('Hair Treatments') },
          { label: 'View All Services', actionType: 'services' },
        ],
      };
    }

    // 3. GENERAL PRICES / COST
    if (
      q.includes('price') ||
      q.includes('prices') ||
      q.includes('cost') ||
      q.includes('how much') ||
      q.includes('rate') ||
      q.includes('rates') ||
      q.includes('charge') ||
      q.includes('pricing') ||
      q.includes('fee') ||
      q.includes('fees') ||
      q.includes('estimate')
    ) {
      return {
        text: "Here are our current starting prices at Lillu Salon:\n\n• Hair Styling — from ₹999\n• Hair Color & Balayage — from ₹2,499\n• Signature Facial — from ₹1,799\n• Manicure & Pedicure — from ₹1,299\n• Makeup — from ₹3,499\n• Hair Treatments / Spa — from ₹1,999\n• Skin Brightening Therapies — from ₹2,199\n• Luxury Bridal Beauty — from ₹15,999\n\n*All services include a complimentary styling consultation upon arrival.",
        actions: [
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
          { label: '✨ View Service Menu', actionType: 'services' },
        ],
      };
    }

    // 4. SERVICES / MENU
    if (
      q.includes('service') ||
      q.includes('services') ||
      q.includes('menu') ||
      q.includes('offerings') ||
      q.includes('what do you do') ||
      q.includes('what do you offer') ||
      q.includes('package')
    ) {
      return {
        text: "Of course! Here are our available salon services:\n\n✨ Hair: Precision cuts, global colour, balayage, keratin & spa therapies\n✨ Skin: Signature glow facials, brightening & renewal treatments\n✨ Nails: Classic & gel manicures, luxury pedicures, nail extensions\n✨ Makeup: Everyday glam, cocktail & red carpet makeup, bridal beauty\n\nAlso available: Threading & Waxing, Kids' Haircuts, and Head Massages.",
        actions: [
          { label: '💎 View Prices', actionType: 'prices' },
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
        ],
      };
    }

    // 5. BOOKING / APPOINTMENT
    if (
      q.includes('book') ||
      q.includes('appointment') ||
      q.includes('reserve') ||
      q.includes('reservation') ||
      q.includes('slot') ||
      q.includes('schedule') ||
      q.includes('visit')
    ) {
      return {
        text: "We'd love to welcome you! ✨\n\nYou can book your appointment right here on our website or connect directly on WhatsApp for instant booking assistance.",
        actions: [
          { label: '📅 Go to Booking Form', onClick: () => handleScrollToBooking() },
          { label: '💬 Book via WhatsApp', isWhatsApp: true },
        ],
      };
    }

    // 6. LOCATION / ADDRESS / DIRECTIONS
    if (
      q.includes('location') ||
      q.includes('where') ||
      q.includes('address') ||
      q.includes('place') ||
      q.includes('direction') ||
      q.includes('directions') ||
      q.includes('map') ||
      q.includes('bandra') ||
      q.includes('mumbai')
    ) {
      return {
        text: "📍 Lillu Salon is located at:\n\n3rd Floor, Sunrise Arcade, Linking Road\nBandra West, Mumbai, Maharashtra 400050\n\nWe are open 7 days a week from 10:00 AM to 8:00 PM.",
        actions: [
          { label: '🗺️ Open Google Maps', isMaps: true },
          { label: '📅 Book a Visit', onClick: () => handleScrollToBooking() },
        ],
      };
    }

    // 7. CONTACT / PHONE / WHATSAPP / EMAIL
    if (
      q.includes('contact') ||
      q.includes('phone') ||
      q.includes('call') ||
      q.includes('number') ||
      q.includes('email') ||
      q.includes('whatsapp') ||
      q.includes('talk') ||
      q.includes('reception')
    ) {
      return {
        text: "📞 You can easily reach the Lillu Salon team at:\n\n• Phone: +91 70454 01446\n• WhatsApp: +91 70454 01446\n• Email: K2salon23@gmail.com\n\nStudio Hours: 10:00 AM – 8:00 PM daily.",
        actions: [
          { label: '💬 Message on WhatsApp', isWhatsApp: true },
          { label: '📞 Call Studio', isPhone: true },
        ],
      };
    }

    // 8. OFFERS / DISCOUNTS
    if (
      q.includes('offer') ||
      q.includes('discount') ||
      q.includes('deal') ||
      q.includes('promo') ||
      q.includes('coupon') ||
      q.includes('first visit') ||
      q.includes('special')
    ) {
      return {
        text: "🎁 Special Welcome Offer:\n\nEnjoy 10% OFF your first beauty appointment at Lillu Salon!\n\nJust book your slot through our website or mention the welcome offer during your consultation.",
        actions: [
          { label: '✨ Claim 10% Off & Book', onClick: () => handleScrollToBooking() },
          { label: '💎 View Services & Prices', actionType: 'prices' },
        ],
      };
    }

    // 9. GREETINGS
    if (
      q === 'hi' ||
      q === 'hello' ||
      q === 'hey' ||
      q.startsWith('hi ') ||
      q.startsWith('hello ') ||
      q.startsWith('hey ') ||
      q.includes('good morning') ||
      q.includes('good afternoon') ||
      q.includes('good evening') ||
      q.includes('namaste')
    ) {
      return {
        text: "Hello! ✨ Welcome to Lillu Salon. How can I assist you with your beauty and hair styling needs today?",
        actions: [
          { label: '📅 Book an appointment', actionType: 'book' },
          { label: '✨ View services', actionType: 'services' },
          { label: '💎 Prices', actionType: 'prices' },
          { label: '⏰ Opening hours', actionType: 'hours' },
        ],
      };
    }

    // 10. THANKS / APPRECIATION
    if (
      q.includes('thank') ||
      q.includes('thanks') ||
      q.includes('awesome') ||
      q.includes('great') ||
      q.includes('perfect') ||
      q.includes('helpful')
    ) {
      return {
        text: "You're most welcome! 💫 Let us know if you need anything else, or book an appointment anytime to visit our studio.",
        actions: [
          { label: '📅 Book an appointment', onClick: () => handleScrollToBooking() },
          { label: '💬 Chat on WhatsApp', isWhatsApp: true },
        ],
      };
    }

    // 11. FALLBACK RESPONSE
    return {
      text: "I'm still learning 😊 Please choose one of the options below, or contact our salon team for assistance.",
      actions: [
        { label: '📅 Book an appointment', actionType: 'book' },
        { label: '✨ View services', actionType: 'services' },
        { label: '💎 Prices', actionType: 'prices' },
        { label: '⏰ Opening hours', actionType: 'hours' },
        { label: '📞 Contact Salon', actionType: 'contact' },
      ],
    };
  }

  function handleQuickAction(actionId) {
    let userLabel = '';
    let botResponse = null;

    if (actionId === 'book') {
      userLabel = 'Book an appointment';
      botResponse = {
        text: "We're excited to pamper you! ✨\n\nClick below to jump directly to our booking form, or message us on WhatsApp for instant confirmation.",
        actions: [
          { label: '📅 Go to Booking Form', onClick: () => handleScrollToBooking() },
          { label: '💬 Book via WhatsApp', isWhatsApp: true },
        ],
      };
    } else if (actionId === 'services') {
      userLabel = 'View services';
      botResponse = {
        text: "Here are our signature salon services crafted for your transformation:\n\n💇‍♀️ Hair: Precision Haircuts, Global Colour, Balayage, Keratin Spa\n✨ Skin: Signature Facials, Brightening, Deep Hydration\n💅 Nails: Manicure & Pedicure, Gel Polish, Nail Extensions\n💄 Beauty: Makeup, Party Glam, Bridal Beauty Packages\n\nAlso available: Threading & Waxing, Kids' Haircuts, Head Massage.",
        actions: [
          { label: '💎 View Prices', actionType: 'prices' },
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
        ],
      };
    } else if (actionId === 'prices') {
      userLabel = 'Prices';
      botResponse = {
        text: "Here is our current price guide starting rates:\n\n• Hair Styling — from ₹999\n• Hair Color & Balayage — from ₹2,499\n• Signature Facial — from ₹1,799\n• Manicure & Pedicure — from ₹1,299\n• Makeup — from ₹3,499\n• Hair Treatments — from ₹1,999\n• Skin Treatments — from ₹2,199\n• Bridal Beauty — from ₹15,999\n\nEvery appointment comes with a complimentary personalized consultation!",
        actions: [
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
          { label: '✨ View All Services', actionType: 'services' },
        ],
      };
    } else if (actionId === 'hours') {
      userLabel = 'Opening hours';
      botResponse = {
        text: "Studio Hours:\n\n⏰ Monday – Sunday: 10:00 AM – 8:00 PM\n(Open all 7 days a week)\n\nWalk-ins are welcome, but advance bookings receive priority slots.",
        actions: [
          { label: '📅 Book an Appointment', onClick: () => handleScrollToBooking() },
          { label: '📍 Get Directions', isMaps: true },
        ],
      };
    } else if (actionId === 'location') {
      userLabel = 'Where are you located?';
      botResponse = {
        text: "📍 Lillu Salon is located at:\n\n3rd Floor, Sunrise Arcade, Linking Road\nBandra West, Mumbai, Maharashtra 400050",
        actions: [
          { label: '🗺️ Open in Google Maps', isMaps: true },
          { label: '📅 Book a Visit', onClick: () => handleScrollToBooking() },
        ],
      };
    } else if (actionId === 'contact') {
      userLabel = 'Contact information';
      botResponse = {
        text: "📞 Reach our salon desk directly:\n\n• Phone: +91 70454 01446\n• WhatsApp: +91 70454 01446\n• Email: K2salon23@gmail.com\n• Hours: 10:00 AM – 8:00 PM daily",
        actions: [
          { label: '💬 Message on WhatsApp', isWhatsApp: true },
          { label: '📞 Call Now', isPhone: true },
        ],
      };
    }

    if (userLabel && botResponse) {
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: userLabel,
        time: getTimeString(),
      };

      const botMsg = {
        id: `assistant-${Date.now() + 1}`,
        sender: 'assistant',
        text: botResponse.text,
        time: getTimeString(),
        actions: botResponse.actions,
      };

      setMessages((prev) => [...prev, userMsg, botMsg]);
    }
  }

  function handleSendMessage(e) {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: getTimeString(),
    };

    setInputText('');

    const botResult = generateResponse(query);
    const botMsg = {
      id: `assistant-${Date.now() + 1}`,
      sender: 'assistant',
      text: botResult.text,
      time: getTimeString(),
      actions: botResult.actions,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  }

  return (
    <>
      {/* Floating Chatbot Launcher Button */}
      <div className="chatbot-launcher-wrap">
        <button
          type="button"
          className={`chatbot-launcher ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close Lillu Salon Assistant' : 'Open Lillu Salon Assistant'}
          aria-expanded={isOpen}
          aria-controls="lilluChatbotPanel"
        >
          {isOpen ? (
            /* Close Cross Icon */
            <svg className="chatbot-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* Sparkle + Chat Icon */
            <div className="chatbot-launcher-inner">
              <svg className="chatbot-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span className="chatbot-sparkle-dot">✨</span>
            </div>
          )}
          <span className="chatbot-launcher-tooltip">Chat with Assistant</span>
        </button>
      </div>

      {/* Chatbot Panel Modal */}
      {isOpen && (
        <div
          id="lilluChatbotPanel"
          className="chatbot-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Lillu Salon Assistant"
          ref={chatContainerRef}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <span className="chatbot-avatar-text">✨</span>
                <span className="chatbot-status-indicator" title="Online" />
              </div>
              <div className="chatbot-header-text">
                <h3 className="chatbot-title">✨ Lillu Assistant</h3>
                <span className="chatbot-subtitle">Beauty Concierge · Online</span>
              </div>
            </div>
            <button
              type="button"
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Assistant"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`chatbot-msg-row ${isAssistant ? 'msg-assistant' : 'msg-user'}`}
                >
                  {isAssistant && (
                    <div className="chatbot-msg-avatar" aria-hidden="true">
                      ✨
                    </div>
                  )}
                  <div className="chatbot-msg-content">
                    <div className="chatbot-bubble">
                      <p className="chatbot-bubble-text">{msg.text}</p>
                    </div>
                    {msg.time && <span className="chatbot-time">{msg.time}</span>}

                    {/* Initial Quick Action Buttons under Welcome Message */}
                    {msg.showQuickActions && (
                      <div className="chatbot-quick-actions">
                        {QUICK_ACTIONS.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className="chatbot-chip"
                            onClick={() => handleQuickAction(action.id)}
                          >
                            <span className="chip-icon">{action.icon}</span>
                            <span>{action.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Action buttons returned with specific responses */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="chatbot-action-buttons">
                        {msg.actions.map((act, idx) => {
                          if (act.isWhatsApp) {
                            return (
                              <a
                                key={idx}
                                href="https://wa.me/917045401446?text=Hi%20LILLU%20SALON%2C%20I%27d%20like%20to%20know%20more."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chatbot-action-btn btn-wa"
                              >
                                💬 WhatsApp Booking
                              </a>
                            );
                          }
                          if (act.isMaps) {
                            return (
                              <a
                                key={idx}
                                href="https://maps.app.goo.gl/2rLWdMA1UQsdUJ3e6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chatbot-action-btn btn-map"
                              >
                                📍 Google Maps Directions
                              </a>
                            );
                          }
                          if (act.isPhone) {
                            return (
                              <a
                                key={idx}
                                href="tel:+917045401446"
                                className="chatbot-action-btn btn-tel"
                              >
                                📞 Call +91 70454 01446
                              </a>
                            );
                          }
                          if (act.actionType) {
                            return (
                              <button
                                key={idx}
                                type="button"
                                className="chatbot-action-btn"
                                onClick={() => handleQuickAction(act.actionType)}
                              >
                                {act.label}
                              </button>
                            );
                          }
                          return (
                            <button
                              key={idx}
                              type="button"
                              className="chatbot-action-btn primary"
                              onClick={act.onClick}
                            >
                              {act.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form className="chatbot-input-bar" onSubmit={handleSendMessage}>
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              aria-label="Type your message"
            />
            <button
              type="submit"
              className="chatbot-send-btn"
              disabled={!inputText.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
