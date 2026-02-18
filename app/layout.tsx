'use client';

import './globals.css';
import TopNavbar from '@/components/TopNavbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { usePathname } from 'next/navigation';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Google Fonts URL for the school's heading and body fonts
  const fontsUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    config.fonts.heading
  )}:wght@400;600;700&family=${encodeURIComponent(
    config.fonts.body
  )}:wght@300;400;500;600;700&display=swap`;

  return (
    <html
      lang="en"
      style={
        {
          '--color-primary': config.colors.primary,
          '--color-primary-light': config.colors.primaryLight,
          '--color-primary-dark': config.colors.primaryDark,
          '--color-primary-50': config.colors.primary50,
          '--color-primary-100': config.colors.primary100,
          '--color-accent': config.colors.accent,
          '--color-secondary': config.colors.secondary,
          '--font-heading': `"${config.fonts.heading}", serif`,
          '--font-body': `"${config.fonts.body}", sans-serif`,
        } as React.CSSProperties
      }
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={fontsUrl} rel="stylesheet" />
      </head>
      <body className="font-body">
        {isAdminRoute ? (
          // Admin routes - no public navigation
          <>
            {children}
            <ScrollToTop />
          </>
        ) : (
          // Public routes - show navigation and footer
          <div className="min-h-screen flex flex-col">
            <TopNavbar />
            <Header />
            <main className="flex-grow pt-32 sm:pt-36 lg:pt-32">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        )}
      </body>
    </html>
  );
}
