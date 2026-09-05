import Script from 'next/script';
import './globals.css';
import Nav from '@/components/Nav';
import MobileMenu from '@/components/MobileMenu';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Lightbox from '@/components/Lightbox';
import Chatbot from '@/components/Chatbot';

export const metadata = {
  title: 'LILLU SALON — Beauty, Refined.',
  description: 'LILLU SALON — a modern beauty studio for hair, skin, nails and makeup in Mumbai.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <MobileMenu />
        {children}
        <WhatsAppFloat />
        <Chatbot />
        <Lightbox />
        <Script src="/site.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
