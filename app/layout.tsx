'use client';

import type { Metadata } from 'next';
import './globals.css';
import TopNavbar from '@/components/TopNavbar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body>
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
