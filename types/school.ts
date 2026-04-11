// SchoolConfig — the complete configuration for a school deployment.
// Each school has one of these in schools/{slug}/config.ts.
// All fields are used by components/pages to render school-specific content.

export interface SchoolConfig {
  // === IDENTITY ===
  id: string;
  name: string;
  fullName: string;
  logo: string;
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
      holiday?: string; // e.g. "Public holidays: Closed"
    };
    googleMapsEmbedUrl: string;
    transportation?: {
      byCar: string;
      byBus: string;
    };
    formSubjects: Array<{ value: string; label: string }>; // contact form subject dropdown options
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

  // === OUR STORY ===
  story: string[];

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
      label: string; // e.g. "Excellent", "Good", "Satisfactory"
    }>;
    assessmentWeights: string;
    features: Array<{
      title: string;
      detail: string;
    }>;
    calendarSlides: number; // number of calendar images (1.jpg, 2.jpg, ... N.jpg)
    examSchedule: Array<{
      exam: string;
      date: string;
      grade: string;
    }>;
    resultsStats: Array<{
      value: string;   // e.g. "98%"
      label: string;   // e.g. "SEE Pass Rate"
      subtitle: string; // e.g. "2081 Batch"
    }>;
  };

  // === FAQS (Contact Page) ===
  faqs: Array<{
    question: string;
    answer: string;
  }>;

  // === FACILITIES ===
  facilities: {
    main: Array<{
      name: string;
      description: string;
      icon: string;
      highlights: string[];
      image?: string; // path to facility photo, e.g. "/school-assets/facilities/library.jpeg"
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
    image?: string;
  }>;

  // === ADMISSION ===
  admission: {
    heroSubtitle: string;
    steps: Array<{ step: number; title: string; description: string }>;
    requiredDocuments: string[];
  };

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

  // === HOMEPAGE FEATURE CARDS ===
  features: Array<{
    title: string;
    description: string;
    icon: string; // lucide icon name: "BookOpen" | "Users" | "Award" | etc.
  }>;

  // === HOMEPAGE CTA SECTION ===
  cta: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonHref: string;
  };

  // === GALLERY ===
  gallery: {
    categories: string[]; // filter categories shown on gallery page, first item should be "All"
  };

  // === NOTICES ===
  notices: {
    categories: string[]; // filter categories shown on notices page, first item should be "All"
  };

  // === PAGE HERO SUBTITLES ===
  pages: {
    about:     { heroSubtitle: string };
    academics: { heroSubtitle: string };
    contact:   { heroSubtitle: string };
    events:    { heroSubtitle: string };
    facilities:{ heroSubtitle: string };
    gallery:   { heroSubtitle: string };
    notices:   { heroSubtitle: string };
    others:    { heroSubtitle: string };
  };

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
    navItems: Array<{ name: string; href: string }>; // navigation menu items
  };

  // === PRINCIPAL'S MESSAGE (About Page) ===
  principalMessage: string[]; // array of quote paragraphs shown in the Principal's Message section

  // === SOCIAL MEDIA ===
  social: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
}
