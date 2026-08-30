// Maps the 8 existing service names to their exact original hand-picked icon.
// Any service added later via the admin dashboard that doesn't match one of
// these names falls back to a generic sparkle icon rather than breaking.
const ICON_PATHS = {
  'Hair Styling': <path d="M6 3c-2 3-2 6 0 9M18 3c2 3 2 6 0 9M6 12c0 5 3 9 6 9s6-4 6-9" />,
  'Hair Color': (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
    </>
  ),
  'Signature Facial': <path d="M12 3c4 3 6 6 6 10a6 6 0 1 1-12 0c0-4 2-7 6-10Z" />,
  'Manicure & Pedicure': <path d="M9 3v4M15 3v4M4 11c0-2 1-3 3-3h10c2 0 3 1 3 3v3a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-3Z" />,
  'Makeup': (
    <>
      <path d="M4 20 16 8l3 3-12 12H4v-3Z" />
      <path d="M14 6l4 4" />
    </>
  ),
  'Bridal Beauty': <path d="M12 21c-5-4-8-7-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 4-3 7-8 11Z" />,
  'Hair Treatments': <path d="M4 6c4 2 4 5 0 7 4 2 4 5 0 7M20 6c-4 2-4 5 0 7-4 2-4 5 0 7" />,
  'Skin Treatments': (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
};

// Generic fallback icon (a soft sparkle) for services not in the map above.
const DEFAULT_ICON = (
  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
);

export default function ServiceIcon({ name }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name] || DEFAULT_ICON}
    </svg>
  );
}
