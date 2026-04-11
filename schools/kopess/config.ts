import type { SchoolConfig } from "@/types/school";

const config: SchoolConfig = {
  // === IDENTITY ===
  id: "kopess",
  name: "KOPESS",
  fullName: "Kotdevi Public English Sec. School",
  logo: "/school-assets/kopess_logo.jpg",
  tagline: "Academic Excellence Through Quality Education",
  description:
    "Committed to providing quality education and fostering holistic development of students through innovative teaching methods and comprehensive learning experiences.",
  foundedYear: 2051,

  // === HERO SECTION ===
  hero: {
    type: "video",
    videoSrc: "/school-assets/hero-video.mp4",
    videoWebmSrc: "/school-assets/hero-video.webm",
    fallbackImage: "/school-assets/kopess_logo.jpg",
    headline: "KOPESS",
    subheadline:
      "Nurturing young minds, building bright futures, and creating tomorrow's leaders through innovative education and holistic development.",
    ctaPrimary: { label: "Apply Now", href: "/admission" },
    ctaSecondary: { label: "Learn More", href: "/about" },
  },

  // === STATS (Homepage) ===
  stats: {
    students: "500+",
    faculty: "25+",
    programs: "20+",
    yearsOfExcellence: "25+",
  },

  // === CONTACT INFO ===
  contact: {
    address: "Kotdevi, Kirtipur-5, Kathmandu, Nepal", // TODO: confirm exact address with school
    phones: {
      main: "+977 (01) 5149662",
      admissions: "+977 (01) 5149662", // TODO: confirm with school
      emergency: "+977 9851079363",  // TODO: confirm with school
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
    transportation: {
      byCar: "Free parking available on school premises",
      byBus: "Bus routes through Balkumari and Jadibuti",
    },
    formSubjects: [
      { value: "admission",  label: "Admission Inquiry"    },
      { value: "academic",   label: "Academic Information" },
      { value: "facilities", label: "Facilities"           },
      { value: "events",     label: "Events & Activities"  },
      { value: "general",    label: "General Inquiry"      },
      { value: "complaint",  label: "Complaint"            },
      { value: "other",      label: "Other"                },
    ],
    googleMapsEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.4718522915846!2d85.34655857525254!3d27.671807676202977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f0a50c9419%3A0xb91aba5ece08fc44!2sKotdevi%20Public%20English%20Sec.%20School!5e0!3m2!1sen!2snp!4v1775022955537!5m2!1sen!2snp",
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
      phone: "+977 (01) 5149662",
      email: "academics@kopess.edu.np",
    },
    {
      name: "Student Affairs",
      phone: "+977 (01) 5202003",
      email: "students@kopess.edu.np",
    },
    {
      name: "Finance Department",
      phone: "+977 (01) 5149662",
      email: "finance@kopess.edu.np",
    },
    {
      name: "IT Support",
      phone: "+977 (01) 5149662",
      email: "support@kopess.edu.np",
    },
  ],

  // === LEADERSHIP TEAM (About Page) ===
  // TODO: Update with real names, roles and qualifications from school
  // TODO: Replace image paths with real photos — place them in schools/kopess/assets/team/
  leadership: [
    {
      name: "Arjun Dahal",
      role: "Chairman",
      qualification: "M.Ed.",
      image: "/school-assets/team/chairperson.jpeg",
    },
    {
      name: "Navraj Bhatta",
      role: "Principal",
      qualification: "M.Ed.",
      image: "/school-assets/team/principal.jpeg",
    },
    {
      name: "Puran Basnet",
      role: "Vice Principal",
      qualification: "M.Ed.",
      image: "/school-assets/team/vice-principal.jpeg",
    },
    {
      name: "Radha Karki ",
      role: "School Coordinator",
      qualification: "M.A.",
      image: "/school-assets/team/academic-coordinator.jpg",
    },
    {
      name: "Laxmi Lamichane",
      role: "School Incharge",
      qualification: "MBA",
      image: "/school-assets/team/head-administration.jpg",
    },
  ],

  // === MILESTONES (About Page) ===
  milestones: [
    { year: "2051", title: "School established in Kotdevi, Kirtipur" },
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

  // === OUR STORY ===
  story: [
    "Education plays vital role in the gradual development of human civilization. It is obvious that the prosperity of any nation cannot be thought in the absence of sound and productive education. Bearing the same concept in mind Kotdevi Public English Secondary School was established in 2051 B.S. (1993 A.D.) to educate and produce sensible, honest, challenging and competitive citizens by imparting them behavioral as well as scientific educational classes.",
    "The school currently offers education from grade Nursery to X, and with a long-term vision to expand up to the Higher Secondary Level. Every step we take is guided by this goal, ensuring that our infrastructure, faculty, and academic programs are developed accordingly to provide a strong foundation for higher education in the near future.",
    "Situated in the heart of Kathmandu Valley, our school is dedicated to offering a nurturing environment that balances academic excellence with values, creativity, discipline, and life skills. We believe that every child is unique and has the potential to make a meaningful contribution to the world when guided with the right blend of knowledge and values.",
    "At KOPESS, we encourage holistic development through a well-rounded curriculum, ECA/CCA activities, and a strong emphasis on moral education. Our team of experienced and passionate educators work tirelessly to inspire curiosity, confidence, and compassion in every student.",
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
          "Accountancy",
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
      { grade: "A+", range: "90-100%",   gpa: "4.0", label: "Outstanding"     },
      { grade: "A",  range: "80-89%",    gpa: "3.6", label: "Excellent"        },
      { grade: "B+", range: "70-79%",    gpa: "3.2", label: "Very Good"        },
      { grade: "B",  range: "60-69%",    gpa: "2.8", label: "Good"             },
      { grade: "C+", range: "50-59%",    gpa: "2.4", label: "Satisfactory"     },
      { grade: "C",  range: "40-49%",    gpa: "2.0", label: "Acceptable"       },
      { grade: "D",  range: "Below 40%", gpa: "0.0", label: "Not Sufficient"   },
    ],
    assessmentWeights: "Continuous Assessment (40%), Terminal Examination (60%)",
    calendarSlides: 6, // 6 scanned calendar images in assets/calendar/
    features: [
      { title: "Small Class Sizes", detail: "25:1 student-teacher ratio" },
      { title: "Practical Labs", detail: "Science & Computer labs" },
      { title: "SEE Preparation", detail: "Dedicated SEE coaching & revision" },
    ],
    examSchedule: [
      { exam: "First Terminal Examination", date: "Ashad (July)", grade: "All Grades" },
      { exam: "Second Terminal Examination", date: "Ashwin (October)", grade: "All Grades" },
      { exam: "Third Terminal Examination", date: "Poush (January)", grade: "All Grades" },
      { exam: "Final Examination", date: "Chaitra (March–April)", grade: "All Grades" },
    ],
    // TODO: Update with real KOPESS SEE results data
    resultsStats: [
      { value: "98%",  label: "SEE Pass Rate",        subtitle: "2081 Batch"         },
      { value: "45%",  label: "Distinction (A+/A)",   subtitle: "SEE 2081"           },
      { value: "3.5",  label: "Average GPA",          subtitle: "Graduating batch"   },
      { value: "85%",  label: "College Enrollment",   subtitle: "Of SEE graduates"   },
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
        image: "/school-assets/facilities/library.jpeg",
        highlights: [
          "10,000+ books",
          "Reference materials",
          "Study rooms",
          "Nepali & English titles",
        ],
      },
 /*     {
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
      },*/
      {
        name: "Computer Lab",
        description:
          "Modern computer facilities with internet access for digital literacy programs.",
        icon: "Monitor",
        image: "/school-assets/facilities/computerlab.jpeg",
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
        image: "/school-assets/facilities/playground.jpeg",
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
        image: "/school-assets/facilities/canteen.jpeg",
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
        image: "/school-assets/facilities/multipurposehall.jpeg",
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
  // TODO: Replace image paths with real photos — place them in schools/kopess/assets/alumni/
  alumni: [
    {
      name: "To be updated",
      classOf: "2010",
      achievement: "Notable alumni — details to be confirmed",
      role: "Professional",
      image: "/school-assets/alumni/alumni-1.jpg",
    },
    {
      name: "To be updated",
      classOf: "2015",
      achievement: "Notable alumni — details to be confirmed",
      role: "Professional",
      image: "/school-assets/alumni/alumni-2.jpg",
    },
  ],

  // === ADMISSION ===
  admission: {
    heroSubtitle: "Begin your child's journey of excellence with us. We are committed to nurturing young minds and building bright futures through quality education.",
    steps: [
      { step: 1, title: "Submit Application",  description: "Complete and submit the online application form"                  },
      { step: 2, title: "Document Review",     description: "We review your application and supporting documents"              },
      { step: 3, title: "Assessment",          description: "Student assessment and parent interview"                          },
      { step: 4, title: "Decision",            description: "Receive admission decision within 5-7 working days"              },
      { step: 5, title: "Enrollment",          description: "Complete enrollment process and pay fees"                         },
    ],
    requiredDocuments: [
      "Completed application form",
      "Previous school transcripts",
      "Birth certificate",
      "Immunization records",
      "Passport-size photographs (2)",
      "Parent/Guardian citizenship copy",
      "Previous school leaving certificate",
      "Medical examination report",
    ],
  },

  // === ADMISSION DATES (Nepal BS Calendar) ===
  admissionDates: {
    applicationPeriod: "Poush - Falgun 2082 (Dec 2025 - Feb 2026)",
    assessmentDates: "Chaitra 2082 (March 2026)",
    results: "Chaitra 30, 2082",
    enrollmentDeadline: "Baishakh 15, 2083",
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

  // === HOMEPAGE FEATURE CARDS ===
  features: [
    {
      title: "Academic Excellence",
      description: "Rigorous curriculum designed to challenge and inspire students to reach their full potential.",
      icon: "BookOpen",
    },
    {
      title: "Expert Faculty",
      description: "Dedicated and experienced teachers committed to student success and personal growth.",
      icon: "Users",
    },
    {
      title: "Extracurricular Activities",
      description: "Wide range of sports, arts, and cultural activities to develop well-rounded personalities.",
      icon: "Award",
    },
  ],

  // === HOMEPAGE CTA SECTION ===
  cta: {
    title: "Ready to Join Our Community?",
    description: "Take the first step towards your child's bright future. Apply now and become part of our excellence tradition.",
    buttonLabel: "Start Your Application",
    buttonHref: "/admission",
  },

  // === GALLERY ===
  gallery: {
    categories: ["All", "Campus", "Events", "Sports", "Cultural", "Academic", "Other"],
  },

  // === NOTICES ===
  notices: {
    categories: ["All", "Academic", "Sports", "Health", "Arts", "General"],
  },

  // === PAGE HERO SUBTITLES ===
  pages: {
    about: {
      heroSubtitle: "Discover our rich history, unwavering mission, and commitment to educational excellence that has shaped generations of successful leaders.",
    },
    academics: {
      heroSubtitle: "Comprehensive educational programs designed to challenge, inspire, and prepare students for success in higher education and beyond.",
    },
    contact: {
      heroSubtitle: `We're here to help! Get in touch with us for any questions, concerns, or information about KOPESS. We look forward to hearing from you.`,
    },
    events: {
      heroSubtitle: "Celebrating achievements, fostering community, and creating lasting memories through our diverse range of school events and activities.",
    },
    facilities: {
      heroSubtitle: "KOPESS provides state-of-the-art facilities designed to enhance learning, promote creativity, and ensure the safety and well-being of our students.",
    },
    gallery: {
      heroSubtitle: "A visual journey through life at KOPESS — campus moments, events, sports, and more.",
    },
    notices: {
      heroSubtitle: "Stay informed with the latest announcements, updates, and important information from KOPESS administration.",
    },
    others: {
      heroSubtitle: "Discover the vibrant community life at KOPESS through our house system, clubs, extracurricular activities, and the inspiring achievements of our alumni.",
    },
  },

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

  // === FAQS (Contact Page) ===
  faqs: [
    {
      question: "What are your school hours?",
      answer: "School hours are Sunday–Friday, 10:00 AM to 4:00 PM. The administrative office is open from 10:00 AM to 5:00 PM.",
    },
    {
      question: "How can I schedule a school visit?",
      answer: `You can schedule a visit by calling our admissions office at +977 (01) 5202001 or by submitting our online contact form. We welcome parents and prospective students anytime during office hours.`,
    },
    {
      question: "When does the admission process start?",
      answer: "Admissions typically open in Magh–Falgun (January–February) for the upcoming academic year. Check the Notices section for the exact dates each year.",
    },
  ],

  // === PRINCIPAL'S MESSAGE (About Page) ===
  // TODO: Replace with real principal's message
  principalMessage: [
    "At KOPESS, we believe that every child has the potential to achieve greatness. Our role is to provide the nurturing environment, exceptional resources, and inspiring guidance that allows each student to discover and develop their unique talents.",
    "We are committed to fostering not just academic excellence, but also the development of character, creativity, and critical thinking skills that will serve our students throughout their lives. Together, we are building tomorrow's leaders today.",
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
    navItems: [
      { name: "Home",      href: "/"          },
      { name: "About",     href: "/about"     },
      { name: "Academics", href: "/academics" },
      { name: "Admission", href: "/admission" },
      { name: "Events",    href: "/events"    },
      { name: "Notices",   href: "/notices"   },
      { name: "Facilities",href: "/facilities"},
      { name: "Gallery",   href: "/gallery"   },
      { name: "Others",    href: "/others"    },
      { name: "Contact",   href: "/contact"   },
    ],
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
