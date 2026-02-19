import type { SchoolConfig } from "@/types/school";

const config: SchoolConfig = {
  // === IDENTITY ===
  id: "kopess",
  name: "KOPESS",
  fullName: "Kotdevi Public English Sec. School",
  tagline: "Nurturing Future Leaders",
  description:
    "Committed to providing quality education and fostering holistic development of students through innovative teaching methods and comprehensive learning experiences.",
  foundedYear: 1999,

  // === HERO SECTION ===
  hero: {
    type: "video",
    videoSrc: "/school-assets/hero-video.mp4",
    videoWebmSrc: "/school-assets/hero-video.webm",
    fallbackImage: "/school-assets/kopess logo.jpg",
    headline: "KOPESS",
    subheadline:
      "Nurturing young minds, building bright futures, and creating tomorrow's leaders through innovative education and holistic development.",
    ctaPrimary: { label: "Apply Now", href: "/admission" },
    ctaSecondary: { label: "Learn More", href: "/about" },
  },

  // === STATS (Homepage) ===
  stats: {
    students: "1,200+",
    faculty: "85+",
    programs: "50+",
    yearsOfExcellence: "25+",
  },

  // === CONTACT INFO ===
  contact: {
    address: "Kotdevi, Kirtipur-5, Kathmandu, Nepal", // TODO: confirm exact address with school
    phones: {
      main: "+977 (01) 5202000",
      admissions: "+977 (01) 5202001", // TODO: confirm with school
      emergency: "+977 (01) 5202002",  // TODO: confirm with school
    },
    emails: {
      info: "info@kopess.edu.np",
      admissions: "admissions@kopess.edu.np",
      principal: "principal@kopess.edu.np",
    },
    officeHours: {
      weekdays: "Sunday - Friday: 10:00 AM - 4:00 PM",
      saturday: "Saturday: Closed",
    },
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8464774651875!2d85.29512287546706!3d27.693538676191747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f7a860c4297!2sKotdevi%20Public%20English%20Sec.%20School!5e0!3m2!1sen!2snp!4v1736765372498!5m2!1sen!2snp",
  },

  // === DEPARTMENTS (Contact Page) ===
  // TODO: Confirm real department phone numbers with school
  departments: [
    {
      name: "Principal's Office",
      phone: "+977 (01) 5202000",
      email: "principal@kopess.edu.np",
    },
    {
      name: "Admissions Office",
      phone: "+977 (01) 5202001",
      email: "admissions@kopess.edu.np",
    },
    {
      name: "Academic Office",
      phone: "+977 (01) 5202002",
      email: "academics@kopess.edu.np",
    },
    {
      name: "Student Affairs",
      phone: "+977 (01) 5202003",
      email: "students@kopess.edu.np",
    },
    {
      name: "Finance Department",
      phone: "+977 (01) 5202004",
      email: "finance@kopess.edu.np",
    },
    {
      name: "IT Support",
      phone: "+977 (01) 5202005",
      email: "support@kopess.edu.np",
    },
  ],

  // === LEADERSHIP TEAM (About Page) ===
  // TODO: Update with real names, roles and qualifications from school
  leadership: [
    {
      name: "To be updated",
      role: "Principal",
      qualification: "M.Ed.",
    },
    {
      name: "To be updated",
      role: "Vice Principal",
      qualification: "M.Ed.",
    },
    {
      name: "To be updated",
      role: "Academic Coordinator",
      qualification: "M.A.",
    },
    {
      name: "To be updated",
      role: "Head of Administration",
      qualification: "MBA",
    },
  ],

  // === MILESTONES (About Page) ===
  milestones: [
    { year: "1999", title: "School established in Kotdevi, Kirtipur" },
    { year: "2005", title: "First SEE batch graduated" },
    { year: "2010", title: "New academic block inaugurated" },
    { year: "2015", title: "Computer lab and science lab upgraded" },
    { year: "2020", title: "Online learning program launched" },
    { year: "2024", title: "25 years of excellence celebrated" },
  ],

  // === ACHIEVEMENTS (About Page) ===
  achievements: [
    { year: "2080", title: "Best School in Academic Excellence — District Level" },
    { year: "2079", title: "Outstanding SEE Results — Multiple A+ students" },
    { year: "2078", title: "Excellence in Extracurricular Activities Award" },
    { year: "2077", title: "Community Service Recognition Award" },
  ],

  // === MISSION & VISION ===
  mission:
    "To provide a nurturing environment that promotes academic excellence, character development, and lifelong learning, preparing students to become responsible and contributing citizens of Nepal.",
  vision:
    "To be a leading institution in Nepal that inspires innovation, fosters creativity, and builds future leaders who contribute positively to society.",
  coreValues: [
    "Excellence",
    "Integrity",
    "Respect",
    "Innovation",
    "Community Service",
    "Lifelong Learning",
  ],

  // === ACADEMICS (Nepal NCF — National Curriculum Framework) ===
  academics: {
    programs: [
      {
        level: "Primary (Grade 1-5)",
        grades: "Grade 1 - Grade 5",
        subjects: [
          "English",
          "Nepali",
          "Mathematics",
          "Science",
          "Social Studies",
          "Health & Physical Education",
          "Arts & Craft",
        ],
      },
      {
        level: "Lower Secondary (Grade 6-8)",
        grades: "Grade 6 - Grade 8",
        subjects: [
          "English",
          "Nepali",
          "Mathematics",
          "Science",
          "Social Studies",
          "Computer Science",
          "Health & Physical Education",
          "Optional Mathematics",
        ],
      },
      {
        level: "Secondary (Grade 9-10 — SEE)",
        grades: "Grade 9 - Grade 10",
        subjects: [
          "Compulsory English",
          "Compulsory Nepali",
          "Compulsory Mathematics",
          "Compulsory Science",
          "Compulsory Social Studies",
          "Optional I (Opt. Maths / Account)",
          "Optional II (Computer / EPH)",
        ],
      },
    ],
    // Nepal NEB grading scale
    gradingScale: [
      { grade: "A+", range: "90-100%", gpa: "4.0" },
      { grade: "A",  range: "80-89%",  gpa: "3.6" },
      { grade: "B+", range: "70-79%",  gpa: "3.2" },
      { grade: "B",  range: "60-69%",  gpa: "2.8" },
      { grade: "C+", range: "50-59%",  gpa: "2.4" },
      { grade: "C",  range: "40-49%",  gpa: "2.0" },
      { grade: "D",  range: "Below 40%", gpa: "0.0" },
    ],
    assessmentWeights: "Continuous Assessment (40%), Terminal Examination (60%)",
    calendarSlides: 6, // 6 scanned calendar images in assets/calendar/
    features: [
      { title: "Small Class Sizes", detail: "25:1 student-teacher ratio" },
      { title: "Practical Labs", detail: "Science & Computer labs" },
      { title: "SEE Preparation", detail: "Dedicated SEE coaching & revision" },
    ],
  },

  // === FACILITIES ===
  facilities: {
    main: [
      {
        name: "Library",
        description:
          "Our library houses books, reference materials and digital learning resources for all grade levels.",
        icon: "BookOpen",
        highlights: [
          "10,000+ books",
          "Reference materials",
          "Study rooms",
          "Nepali & English titles",
        ],
      },
      {
        name: "Science Laboratory",
        description:
          "Fully equipped lab for physics, chemistry, and biology practical experiments.",
        icon: "FlaskConical",
        highlights: [
          "Modern equipment",
          "Safety protocols",
          "Practical experiments",
          "SEE practical preparation",
        ],
      },
      {
        name: "Computer Lab",
        description:
          "Modern computer facilities with internet access for digital literacy programs.",
        icon: "Monitor",
        highlights: [
          "50+ computers",
          "High-speed internet",
          "Microsoft Office",
          "Typing & programming",
        ],
      },
      {
        name: "Sports Ground",
        description:
          "Open sports ground for football, cricket, volleyball and athletics.",
        icon: "Trophy",
        highlights: [
          "Football field",
          "Cricket pitch",
          "Volleyball court",
          "Badminton court",
        ],
      },
      {
        name: "Canteen",
        description: "Clean canteen providing healthy and affordable snacks and meals.",
        icon: "UtensilsCrossed",
        highlights: [
          "Hygienic preparation",
          "Affordable prices",
          "Nutritious options",
          "Clean environment",
        ],
      },
      {
        name: "Multipurpose Hall",
        description: "Hall for assemblies, cultural programs, examinations and events.",
        icon: "Theater",
        highlights: [
          "Seating capacity",
          "Stage & sound system",
          "Assembly ground",
          "Cultural events",
        ],
      },
    ],
    additional: [
      {
        name: "Transportation",
        icon: "Bus",
        highlights: [
          "School bus routes",
          "Trained drivers",
          "Multiple routes",
          "Safe & reliable",
        ],
      },
      {
        name: "Security",
        icon: "Shield",
        highlights: [
          "CCTV surveillance",
          "Gated campus",
          "Security personnel",
          "Emergency protocols",
        ],
      },
      {
        name: "Health Room",
        icon: "Heart",
        highlights: [
          "First aid facility",
          "Health monitoring",
          "Emergency response",
          "Staff trained in first aid",
        ],
      },
      {
        name: "Music & Arts Room",
        icon: "Music",
        highlights: [
          "Musical instruments",
          "Art supplies",
          "Cultural activities",
          "Talent development",
        ],
      },
    ],
    safetyFeatures: [
      "Fire safety systems",
      "Emergency evacuation procedures",
      "First aid stations",
      "CCTV monitoring",
      "Gated entry/exit",
      "Emergency communication systems",
      "Regular safety drills",
    ],
    stats: {
      books: "10,000+",
      labs: "5",
      computers: "50+",
      security: "24/7",
    },
  },

  // === BEYOND ACADEMICS (Others Page) ===
  houses: [
    {
      name: "Sagarmatha House",
      color: "Blue",
      motto: "Reach for the Summit",
      achievements: ["Sports Championship 2080", "Academic Excellence Award"],
    },
    {
      name: "Lumbini House",
      color: "Green",
      motto: "Peace and Wisdom",
      achievements: ["Cultural Fest Winner", "Community Service Award"],
    },
    {
      name: "Pashupatinath House",
      color: "Red",
      motto: "Strength and Devotion",
      achievements: ["Debate Championship", "Leadership Excellence"],
    },
    {
      name: "Janakpur House",
      color: "Gold",
      motto: "Heritage and Pride",
      achievements: ["Environmental Award", "Science Olympiad"],
    },
  ],

  clubs: [
    { name: "Drama Club", members: 35 },
    { name: "Science Club", members: 42 },
    { name: "Debate Society", members: 28 },
    { name: "Sports Club", members: 60 },
    { name: "Music Club", members: 30 },
    { name: "Environment Club", members: 25 },
  ],

  extracurriculars: {
    sports: [
      "Football",
      "Cricket",
      "Volleyball",
      "Basketball",
      "Badminton",
      "Athletics",
    ],
    arts: [
      "Painting",
      "Classical Dance",
      "Music",
      "Drama",
      "Photography",
      "Handicrafts",
    ],
    academic: [
      "Math Olympiad",
      "Science Fair",
      "Essay Writing",
      "Quiz Competition",
      "Spelling Contest",
      "Debate",
    ],
    community: [
      "Environment Club",
      "Social Service",
      "Student Council",
      "Peer Tutoring",
      "Community Clean-up",
    ],
  },

  // TODO: Update with real KOPESS alumni and their verified achievements
  alumni: [
    {
      name: "To be updated",
      classOf: "2010",
      achievement: "Notable alumni — details to be confirmed",
      role: "Professional",
    },
    {
      name: "To be updated",
      classOf: "2015",
      achievement: "Notable alumni — details to be confirmed",
      role: "Professional",
    },
  ],

  // === ADMISSION (Nepal BS Calendar) ===
  admissionDates: {
    applicationPeriod: "Poush - Falgun 2081 (Dec 2024 - Feb 2025)",
    assessmentDates: "Chaitra 2081 (March 2025)",
    results: "Chaitra 30, 2081",
    enrollmentDeadline: "Baishakh 15, 2082",
  },

  scholarships: [
    {
      name: "Academic Excellence",
      discount: "Up to 50% tuition",
      criteria: "Outstanding academic performance in previous class",
    },
    {
      name: "Need-Based",
      discount: "Up to 30% tuition",
      criteria: "Demonstrated financial need",
    },
    {
      name: "Talent",
      discount: "Up to 25% tuition",
      criteria: "Exceptional talent in sports or arts",
    },
    {
      name: "Sibling",
      discount: "10% tuition",
      criteria: "Siblings currently enrolled in KOPESS",
    },
  ],

  // === HOMEPAGE CONTENT (Nepal BS Calendar) ===
  upcomingHighlights: [
    { title: "Annual Sports Day", date: "Falgun 15, 2081" },
    { title: "Parent-Teacher Meeting", date: "Falgun 25, 2081" },
    { title: "Science Exhibition", date: "Chaitra 10, 2081" },
  ],

  newsItems: [
    {
      title: "Admission Open for 2081-82",
      date: "Poush 15, 2081",
      category: "Admission",
    },
    {
      title: "Annual Science Fair Results",
      date: "Poush 10, 2081",
      category: "Academic",
    },
    {
      title: "Inter-School Cricket Tournament",
      date: "Mangsir 28, 2081",
      category: "Sports",
    },
    {
      title: "Parents Meeting — Falgun",
      date: "Mangsir 20, 2081",
      category: "Event",
    },
  ],

  // === SEO ===
  seo: {
    titleTemplate: "%s | KOPESS - Nurturing Future Leaders",
    defaultTitle: "KOPESS - Kotdevi Public English Sec. School",
    description:
      "KOPESS provides quality education in Kirtipur, Kathmandu, committed to fostering holistic development of students through innovative teaching methods.",
    keywords: [
      "KOPESS",
      "Kotdevi Public English Sec. School",
      "school in Kirtipur",
      "school in Kathmandu",
      "best school Nepal",
      "education Nepal",
    ],
    ogImage: "/school-assets/og-image.jpg",
  },

  // === THEME COLORS ===
  colors: {
    primary: "#1e40af",
    primaryLight: "#3b82f6",
    primaryDark: "#1e3a5f",
    primary50: "#eff6ff",
    primary100: "#dbeafe",
    accent: "#f59e0b",
    secondary: "#16a34a",
  },

  // === FONTS ===
  fonts: {
    heading: "Playfair Display",
    body: "Inter",
  },

  // === LAYOUT VARIANTS ===
  layout: {
    heroStyle: "video-fullscreen",
    headerStyle: "standard",
    footerStyle: "full",
    homeSections: ["stats", "features", "news", "events", "cta"],
  },

  // === SOCIAL MEDIA ===
  // TODO: Update with real KOPESS social media URLs
  social: {
    facebook: "https://facebook.com/kopess",
    instagram: "https://instagram.com/kopess",
    youtube: "",
    twitter: "",
  },
};

export default config;
