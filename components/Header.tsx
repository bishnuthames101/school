import { getSchoolConfig } from '@/lib/school-config';
import HeaderStandard from './headers/HeaderStandard';

const config = getSchoolConfig();

// Registry of implemented header variants.
// Add new entries here as each variant is built (e.g. transparent, centered).
const headerVariants: Record<string, React.FC> = {
  'standard': HeaderStandard,
};

export default function Header() {
  const HeaderComponent = headerVariants[config.layout.headerStyle] ?? HeaderStandard;
  return <HeaderComponent />;
}
