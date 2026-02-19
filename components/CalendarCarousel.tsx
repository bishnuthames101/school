'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const CalendarCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = config.academics.calendarSlides;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <>
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Main Image Display */}
        <div className="relative aspect-[3/4] md:aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden shadow-2xl">
          <Image
            src={`/school-assets/calendar/${currentSlide + 1}.jpg`}
            alt={`Academic Calendar ${currentSlide + 1}`}
            fill
            className="object-contain"
            priority={currentSlide === 0}
          />

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-800" />
          </button>

          {/* Slide Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
            {currentSlide + 1} / {totalSlides}
          </div>
        </div>

        {/* Thumbnail Navigation - Hidden on mobile */}
        <div className="mt-6 hidden md:flex justify-center gap-3 flex-wrap">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all ${
                currentSlide === index
                  ? 'ring-4 ring-school-primary scale-110'
                  : 'ring-2 ring-gray-300 hover:ring-school-primary-light opacity-70 hover:opacity-100'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={`/school-assets/calendar/${index + 1}.jpg`}
                alt={`Calendar thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="mt-4 flex md:hidden justify-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? 'bg-school-primary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Instruction Text */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="hidden md:block">Use arrow buttons or click thumbnails to navigate</p>
          <p className="md:hidden">Use arrows to navigate</p>
        </div>
      </div>
    </>
  );
};

export default CalendarCarousel;
