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
    fallbackImage: "/school-assets/juniors1.jpg",
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
    address: "123 Education Street, Knowledge City, KC 12345",
    phones: {
      main: "+977 (01) 5202000",
      admissions: "+1 (555) 123-4568",
      emergency: "+1 (555) 123-4569",
    },
    emails: {
      info: "info@kopess.edu",
      admissions: "admissions@kopess.edu",
      principal: "principal@kopess.edu",
    },
    officeHours: {
      weekdays: "Mon-Fri: 8:00 AM - 5:00 PM",
      saturday: "Saturday: 9:00 AM - 2:00 PM",
    },
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8464774651875!2d85.29512287546706!3d27.693538676191747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19b19295555f%3A0xabfe5f7a860c4297!2sKotdevi%20Public%20English%20Sec.%20School!5e0!3m2!1sen!2snp!4v1736765372498!5m2!1sen!2snp",
  },

  // === DEPARTMENTS (Contact Page) ===
  departments: [
    {
      name: "Principal's Office",
      phone: "+1 (555) 123-4567",
      email: "principal@kopess.edu",
    },
    {
      name: "Admissions Office",
      phone: "+1 (555) 123-4568",
      email: "admissions@kopess.edu",
    },
    {
      name: "Academic Office",
      phone: "+1 (555) 123-4570",
      email: "academics@kopess.edu",
    },
    {
      name: "Student Affairs",
      phone: "+1 (555) 123-4571",
      email: "students@kopess.edu",
    },
    {
      name: "Finance Department",
      phone: "+1 (555) 123-4572",
      email: "finance@kopess.edu",
    },
    {
      name: "IT Support",
      phone: "+1 (555) 123-4573",
      email: "support@kopess.edu",
    },
  ],

  // === LEADERSHIP TEAM (About Page) ===
  leadership: [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal",
      qualification: "Ph.D. in Education",
    },
    {
      name: "Mr. Robert Davis",
      role: "Vice Principal",
      qualification: "M.Ed. Mathematics",
    },
    {
      name: "Ms. Emily Chen",
      role: "Academic Director",
      qualification: "M.A. Curriculum Design",
    },
    {
      name: "Dr. Michael Brown",
      role: "Dean of Students",
      qualification: "Ph.D. Psychology",
    },
  ],

  // === MILESTONES (About Page) ===
  milestones: [
    { year: "1999", title: "School established with 50 students" },
    { year: "2005", title: "First graduation ceremony" },
    { year: "2010", title: "New campus expansion" },
    { year: "2015", title: "Technology integration program" },
    { year: "2020", title: "Digital learning platform launch" },
  ],

  // === ACHIEVEMENTS (About Page) ===
  achievements: [
    { year: "2023", title: "Best School in Academic Excellence Award" },
    {
      year: "2022",
      title: "National Recognition for Innovation in Teaching",
    },
    { year: "2021", title: "Excellence in Extracurricular Activities" },
    { year: "2020", title: "Outstanding Community Service Award" },
  ],

  // === MISSION & VISION ===
  mission:
    "To provide a nurturing environment that promotes academic excellence, character development, and lifelong learning, preparing students to become responsible global citizens.",
  vision:
    "To be a leading institution that inspires innovation, fosters creativity, and builds future leaders who contribute positively to society.",
  coreValues: [
    "Excellence",
    "Integrity",
    "Respect for diversity",
    "Innovation",
    "Community service",
    "Lifelong learning",
  ],

  // === ACADEMICS ===
  academics: {
    programs: [
      {
        level: "Elementary (K-5)",
        grades: "Kindergarten - Grade 5",
        subjects: [
          "English Language Arts",
          "Mathematics",
          "Science",
          "Social Studies",
          "Arts & Music",
          "Physical Education",
        ],
      },
      {
        level: "Middle School (6-8)",
        grades: "Grade 6 - Grade 8",
        subjects: [
          "Advanced English",
          "Pre-Algebra & Algebra",
          "Life & Physical Science",
          "World History",
          "Foreign Languages",
          "Computer Science",
          "Health & Wellness",
        ],
      },
      {
        level: "High School (9-12)",
        grades: "Grade 9 - Grade 12",
        subjects: [
          "AP English Literature",
          "Calculus & Statistics",
          "Biology, Chemistry, Physics",
          "US & World History",
          "Computer Programming",
          "Fine Arts",
          "Economics",
        ],
      },
    ],
    gradingScale: [
      { grade: "A", range: "90-100%", gpa: "4.0" },
      { grade: "B", range: "80-89%", gpa: "3.0" },
      { grade: "C", range: "70-79%", gpa: "2.0" },
      { grade: "D", range: "60-69%", gpa: "1.0" },
      { grade: "F", range: "Below 60%", gpa: "0.0" },
    ],
    assessmentWeights:
      "Continuous Assessment (30%), Mid-term (30%), Final (40%), Project Work, Practical",
    calendarSlides: 6, // 6 scanned calendar images in assets/calendar/
    features: [
      { title: "Small Class Sizes", detail: "15:1 student-teacher ratio" },
      { title: "AP Courses", detail: "15+ Advanced Placement courses" },
      { title: "Extended Learning", detail: "After-school programs available" },
    ],
  },

  // === FACILITIES ===
  facilities: {
    main: [
      {
        name: "Modern Library",
        description:
          "Our state-of-the-art library houses over 50,000 books and digital resources.",
        icon: "BookOpen",
        highlights: [
          "50,000+ books",
          "Digital catalog",
          "Study rooms",
          "Research assistance",
        ],
      },
      {
        name: "Science Laboratories",
        description:
          "Fully equipped labs for physics, chemistry, and biology experiments.",
        icon: "FlaskConical",
        highlights: [
          "Advanced equipment",
          "Safety protocols",
          "Interactive experiments",
          "Research projects",
        ],
      },
      {
        name: "Computer Labs",
        description:
          "Modern computer facilities with the latest hardware and software.",
        icon: "Monitor",
        highlights: [
          "Latest computers",
          "High-speed internet",
          "Programming software",
          "Multimedia tools",
        ],
      },
      {
        name: "Sports Complex",
        description:
          "Complete sports facilities for physical education and athletics.",
        icon: "Trophy",
        highlights: [
          "Basketball court",
          "Swimming pool",
          "Football field",
          "Gymnasium",
        ],
      },
      {
        name: "Cafeteria",
        description: "Healthy and nutritious meals prepared daily.",
        icon: "UtensilsCrossed",
        highlights: [
          "Healthy menu",
          "Dietary options",
          "Clean environment",
          "Affordable prices",
        ],
      },
      {
        name: "Art Studios",
        description: "Creative spaces for visual arts and crafts.",
        icon: "Palette",
        highlights: [
          "Art supplies",
          "Natural lighting",
          "Exhibition space",
          "Pottery wheel",
        ],
      },
    ],
    additional: [
      {
        name: "Transportation",
        icon: "Bus",
        highlights: [
          "GPS tracking",
          "Trained drivers",
          "Multiple routes",
          "Safety protocols",
        ],
      },
      {
        name: "Security",
        icon: "Shield",
        highlights: [
          "CCTV surveillance",
          "Access control",
          "Security guards",
          "Emergency protocols",
        ],
      },
      {
        name: "Wi-Fi Campus",
        icon: "Wifi",
        highlights: [
          "Campus-wide coverage",
          "High-speed connection",
          "Student access",
          "Educational content",
        ],
      },
      {
        name: "Health Center",
        icon: "Heart",
        highlights: [
          "Qualified nurse",
          "First aid",
          "Health monitoring",
          "Emergency care",
        ],
      },
      {
        name: "Music Room",
        icon: "Music",
        highlights: ["Piano", "Guitars", "Drums", "Sound system"],
      },
      {
        name: "Auditorium",
        icon: "Theater",
        highlights: [
          "500 seating capacity",
          "Sound system",
          "Stage lighting",
          "Air conditioning",
        ],
      },
    ],
    safetyFeatures: [
      "Fire safety systems",
      "Emergency evacuation procedures",
      "First aid stations",
      "24/7 Security personnel",
      "CCTV monitoring",
      "Secure entry/exit points",
      "Emergency communication systems",
      "Regular safety inspections",
    ],
    stats: {
      books: "50,000+",
      labs: "15",
      computers: "100+",
      security: "24/7",
    },
  },

  // === BEYOND ACADEMICS (Others Page) ===
  houses: [
    {
      name: "Phoenix House",
      color: "Red",
      motto: "Rise with Courage",
      achievements: [
        "Sports Championship 2023",
        "Academic Excellence Award",
      ],
    },
    {
      name: "Eagle House",
      color: "Blue",
      motto: "Soar to Heights",
      achievements: ["Cultural Fest Winner", "Community Service Award"],
    },
    {
      name: "Lion House",
      color: "Gold",
      motto: "Lead with Pride",
      achievements: ["Debate Championship", "Leadership Excellence"],
    },
    {
      name: "Tiger House",
      color: "Green",
      motto: "Strength in Unity",
      achievements: ["Environmental Club Award", "Science Olympiad"],
    },
  ],

  clubs: [
    { name: "Drama Club", members: 45 },
    { name: "Art & Craft Club", members: 38 },
    { name: "Science Club", members: 52 },
    { name: "Sports Club", members: 68 },
    { name: "Music Club", members: 41 },
    { name: "Debate Society", members: 29 },
  ],

  extracurriculars: {
    sports: [
      "Basketball",
      "Soccer",
      "Swimming",
      "Tennis",
      "Track & Field",
      "Volleyball",
    ],
    arts: [
      "Painting",
      "Music",
      "Dance",
      "Photography",
      "Sculpture",
      "Drama",
    ],
    academic: [
      "Math Olympiad",
      "Science Fair",
      "Spelling Bee",
      "Quiz Bowl",
      "Model UN",
      "Robotics",
    ],
    community: [
      "Environmental Club",
      "Volunteer Service",
      "Student Council",
      "Peer Tutoring",
      "Charity Drives",
    ],
  },

  alumni: [
    {
      name: "Dr. Sarah Mitchell",
      classOf: "2010",
      achievement: "Pediatric Surgeon at Harvard Medical",
      role: "Pediatric Surgeon",
    },
    {
      name: "James Rodriguez",
      classOf: "2015",
      achievement: "Tech Entrepreneur, Forbes 30 Under 30",
      role: "Tech Entrepreneur",
    },
    {
      name: "Maria Chen",
      classOf: "2012",
      achievement: "Environmental Scientist at NASA",
      role: "Environmental Scientist",
    },
    {
      name: "David Thompson",
      classOf: "2008",
      achievement: "Olympic Swimmer, 2x medalist",
      role: "Olympic Swimmer",
    },
  ],

  // === ADMISSION ===
  admissionDates: {
    applicationPeriod: "January 1 - March 31, 2024",
    assessmentDates: "April 5-15, 2024",
    results: "April 25, 2024",
    enrollmentDeadline: "May 15, 2024",
  },

  scholarships: [
    {
      name: "Academic Excellence",
      discount: "Up to 50% tuition",
      criteria: "Outstanding academic performance",
    },
    {
      name: "Need-Based",
      discount: "Up to 30% tuition",
      criteria: "Demonstrated financial need",
    },
    {
      name: "Talent",
      discount: "Up to 25% tuition",
      criteria: "Exceptional talent in arts/sports",
    },
    {
      name: "Sibling",
      discount: "10% tuition",
      criteria: "Siblings enrolled in school",
    },
  ],

  // === HOMEPAGE CONTENT ===
  upcomingHighlights: [
    { title: "Annual Cultural Festival", date: "March 25-27, 2024" },
    { title: "Parent-Teacher Conference", date: "April 2, 2024" },
    { title: "Science Exhibition", date: "April 10, 2024" },
  ],

  newsItems: [
    {
      title: "Annual Science Fair 2024",
      date: "March 15, 2024",
      category: "Academic",
    },
    {
      title: "Admission Open for 2024-25",
      date: "March 10, 2024",
      category: "Admission",
    },
    {
      title: "Sports Day Celebration",
      date: "March 8, 2024",
      category: "Sports",
    },
    {
      title: "Parent-Teacher Meeting",
      date: "March 5, 2024",
      category: "Event",
    },
  ],

  // === SEO ===
  seo: {
    titleTemplate: "%s | KOPESS - Nurturing Future Leaders",
    defaultTitle: "KOPESS - Kotdevi Public English Sec. School",
    description:
      "KOPESS provides quality education committed to fostering holistic development of students through innovative teaching methods.",
    keywords: [
      "KOPESS",
      "Kotdevi Public English Sec. School",
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
  social: {
    facebook: "#",
    instagram: "#",
    youtube: "#",
    twitter: "#",
  },
};

export default config;
