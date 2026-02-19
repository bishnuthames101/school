// SchoolConfig — the complete configuration for a school deployment.
// Each school has one of these in schools/{slug}/config.ts.
// All fields are used by components/pages to render school-specific content.

export interface SchoolConfig {
  // === IDENTITY ===
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  foundedYear: number;

  // === HERO SECTION ===
  hero: {
    type: "video" | "image";
    videoSrc?: string;
    videoWebmSrc?: string;
    fallbackImage?: string;
    headline: string;
    subheadline: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };

  // === STATS (Homepage) ===
  stats: {
    students: string;
    faculty: string;
    programs: string;
    yearsOfExcellence: string;
  };

  // === CONTACT INFO ===
  contact: {
    address: string;
    phones: {
      main: string;
      admissions?: string;
      emergency?: string;
    };
    emails: {
      info: string;
      admissions?: string;
      principal?: string;
    };
    officeHours: {
      weekdays: string;
      saturday?: string;
    };
    googleMapsEmbedUrl: string;
  };

  // === DEPARTMENTS (Contact Page) ===
  departments: Array<{
    name: string;
    phone: string;
    email: string;
  }>;

  // === LEADERSHIP TEAM (About Page) ===
  leadership: Array<{
    name: string;
    role: string;
    qualification: string;
    image?: string;
  }>;

  // === MILESTONES (About Page) ===
  milestones: Array<{
    year: string;
    title: string;
  }>;

  // === ACHIEVEMENTS (About Page) ===
  achievements: Array<{
    year: string;
    title: string;
  }>;

  // === MISSION & VISION ===
  mission: string;
  vision: string;
  coreValues: string[];

  // === ACADEMICS ===
  academics: {
    programs: Array<{
      level: string;
      grades: string;
      subjects: string[];
    }>;
    gradingScale: Array<{
      grade: string;
      range: string;
      gpa: string;
    }>;
    assessmentWeights: string;
    features: Array<{
      title: string;
      detail: string;
    }>;
    calendarSlides: number; // number of calendar images (1.jpg, 2.jpg, ... N.jpg)
  };

  // === FACILITIES ===
  facilities: {
    main: Array<{
      name: string;
      description: string;
      icon: string;
      highlights: string[];
    }>;
    additional: Array<{
      name: string;
      icon: string;
      highlights: string[];
    }>;
    safetyFeatures: string[];
    stats: {
      books: string;
      labs: string;
      computers: string;
      security: string;
    };
  };

  // === BEYOND ACADEMICS (Others Page) ===
  houses: Array<{
    name: string;
    color: string;
    motto: string;
    achievements: string[];
  }>;

  clubs: Array<{
    name: string;
    members: number;
  }>;

  extracurriculars: {
    sports: string[];
    arts: string[];
    academic: string[];
    community: string[];
  };

  alumni: Array<{
    name: string;
    classOf: string;
    achievement: string;
    role: string;
  }>;

  // === ADMISSION ===
  admissionDates: {
    applicationPeriod: string;
    assessmentDates: string;
    results: string;
    enrollmentDeadline: string;
  };

  scholarships: Array<{
    name: string;
    discount: string;
    criteria: string;
  }>;

  // === HOMEPAGE CONTENT ===
  upcomingHighlights: Array<{
    title: string;
    date: string;
  }>;

  newsItems: Array<{
    title: string;
    date: string;
    category: string;
  }>;

  // === SEO ===
  seo: {
    titleTemplate: string;
    defaultTitle: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };

  // === THEME COLORS (hex values — injected as CSS variables) ===
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    primary50: string;
    primary100: string;
    accent: string;
    secondary: string;
  };

  // === FONTS (Google Fonts) ===
  fonts: {
    heading: string;
    body: string;
  };

  // === LAYOUT VARIANTS ===
  layout: {
    heroStyle: "video-fullscreen" | "image-slider" | "split-layout";
    headerStyle: "standard" | "transparent" | "centered";
    footerStyle: "full" | "compact" | "minimal";
    homeSections: Array<"stats" | "features" | "news" | "events" | "cta">;
  };

  // === SOCIAL MEDIA ===
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}
