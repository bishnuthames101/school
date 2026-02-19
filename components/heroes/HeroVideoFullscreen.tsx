'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

const HeroVideoFullscreen: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative text-white overflow-hidden min-h-[500px] lg:min-h-[600px]">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster={config.hero.fallbackImage ?? undefined}
        >
          {config.hero.videoSrc && <source src={config.hero.videoSrc} type="video/mp4" />}
          {config.hero.videoWebmSrc && <source src={config.hero.videoWebmSrc} type="video/webm" />}
        </video>

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="absolute bottom-6 right-6 z-20 bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full shadow-lg transition-all hover:scale-110 backdrop-blur-sm"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6" />
          ) : (
            <Volume2 className="h-6 w-6" />
          )}
        </button>

        {/* Fallback Image (shows if video doesn't load) */}
        {config.hero.fallbackImage && (
          <div className="absolute inset-0">
            <Image
              src={config.hero.fallbackImage}
              alt={`${config.name} Students`}
              fill
              className="object-cover -z-10"
              priority
            />
          </div>
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Welcome to <span className="text-yellow-400">{config.hero.headline}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-school-primary-100 max-w-3xl mx-auto drop-shadow-md">
            {config.hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={config.hero.ctaPrimary.href}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-school-primary bg-white hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              {config.hero.ctaPrimary.label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href={config.hero.ctaSecondary.href}
              className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-school-primary transition-colors duration-200 shadow-lg"
            >
              {config.hero.ctaSecondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroVideoFullscreen;
