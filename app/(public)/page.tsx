import type { FC } from 'react';
import HeroSection from '@/components/HeroSection';
import PopupNotice from '@/components/PopupNotice';
import StatsSection from '@/components/home-sections/StatsSection';
import FeaturesSection from '@/components/home-sections/FeaturesSection';
import NewsSection from '@/components/home-sections/NewsSection';
import EventsSection from '@/components/home-sections/EventsSection';
import CTASection from '@/components/home-sections/CTASection';
import { getSchoolConfig } from '@/lib/school-config';

const config = getSchoolConfig();

// Maps section keys (from config.layout.homeSections) to their components.
// To reorder sections for a school, edit config.layout.homeSections.
// To add a new section type, create the component and register it here.
const sectionComponents: Record<string, FC> = {
  stats: StatsSection,
  features: FeaturesSection,
  news: NewsSection,
  events: EventsSection,
  cta: CTASection,
};

export default function HomePage() {
  return (
    <div>
      <PopupNotice />
      <HeroSection />
      {config.layout.homeSections.map((section) => {
        const Section = sectionComponents[section];
        return Section ? <Section key={section} /> : null;
      })}
    </div>
  );
}
