'use client';

import React, { useState, useEffect } from 'react';
import { Phone, Mail, Clock } from 'lucide-react';

const TopNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`bg-blue-900 text-white text-sm transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } fixed top-0 left-0 right-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-2 space-y-2 sm:space-y-0">
          {/* Contact Information */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+977 (01) 5202000 </span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@kopess.edu  </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex items-center space-x-4">
          <a href="tel:+977015202000" className="hover:text-blue-200 transition-colors duration-200">
              Call Now
            </a>

          <a href="mailto:info@kopess.edu" className="hover:text-blue-200 transition-colors duration-200">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
