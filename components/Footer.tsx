import { getSchoolConfig } from '@/lib/school-config';
import FooterFull from './footers/FooterFull';

const config = getSchoolConfig();

// Registry of implemented footer variants.
// Add new entries here as each variant is built (e.g. compact, minimal).
const footerVariants: Record<string, React.FC> = {
  'full': FooterFull,
};

export default function Footer() {
  const FooterComponent = footerVariants[config.layout.footerStyle] ?? FooterFull;
  return <FooterComponent />;
}
