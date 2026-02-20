'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const HeaderStandard: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Academics', href: '/academics' },
    { name: 'Admission', href: '/admission' },
    { name: 'Events', href: '/events' },
    { name: 'Notices', href: '/notices' },
    { name: 'Facilities', href: '/facilities' },
    { name: 'Others', href: '/others' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => pathname === href;

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`bg-white shadow-lg transition-all duration-300 fixed left-0 right-0 z-30 ${
      isVisible
        ? 'translate-y-0 top-28 sm:top-16 lg:top-12'
        : '-translate-y-full top-0'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={handleLinkClick}>
            <Image src={config.logo} alt={config.name} width={36} height={36} className="object-contain" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">{config.name}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">{config.tagline}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 px-2 py-1 ${
                  isActive(item.href)
                    ? 'text-school-primary border-b-2 border-school-primary'
                    : 'text-gray-700 hover:text-school-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-school-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-school-primary transition-colors duration-200 z-50 relative"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-full bg-white shadow-lg border-t border-gray-200 z-40 max-h-screen overflow-y-auto">
            <div className="px-4 py-4">
              <nav className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`text-base font-medium transition-colors duration-200 px-3 py-2 rounded-md ${
                      isActive(item.href)
                        ? 'text-school-primary bg-school-primary-50'
                        : 'text-gray-700 hover:text-school-primary hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderStandard;
