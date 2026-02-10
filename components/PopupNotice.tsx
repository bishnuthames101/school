'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

interface Popup {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const PopupNotice = () => {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchActivePopup();
  }, []);

  const fetchActivePopup = async () => {
    try {
      const response = await fetch('/api/popups');
      const popups = await response.json();

      if (popups && popups.length > 0) {
        const activePopup = popups[0];
        // Show popup on every page load
        setPopup(activePopup);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching popup:', error);
    }
  };

  const handleClose = () => {
    // Close popup for current page view only (will show again on next page load)
    setIsVisible(false);
  };

  if (!isVisible || !popup) {
    return null;
  }

  const PopupContent = (
    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Close popup"
      >
        <X className="h-6 w-6 text-gray-800" />
      </button>

      {/* Popup Image */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
        <Image
          src={popup.imageUrl}
          alt={popup.title}
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {popup.linkUrl ? (
        <Link href={popup.linkUrl} onClick={handleClose}>
          {PopupContent}
        </Link>
      ) : (
        PopupContent
      )}
    </div>
  );
};

export default PopupNotice;
