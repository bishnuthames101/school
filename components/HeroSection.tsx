import { getSchoolConfig } from '@/lib/school-config';
import HeroVideoFullscreen from './heroes/HeroVideoFullscreen';

const config = getSchoolConfig();

// Registry of implemented hero variants.
// Add new entries here as each variant is built (e.g. image-slider, split-layout).
const heroVariants: Record<string, React.FC> = {
  'video-fullscreen': HeroVideoFullscreen,
};

export default function HeroSection() {
  const HeroComponent = heroVariants[config.layout.heroStyle] ?? HeroVideoFullscreen;
  return <HeroComponent />;
}
