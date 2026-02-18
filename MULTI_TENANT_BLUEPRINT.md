# KOPESS Multi-Tenant School Platform — Implementation Blueprint

> This document is the complete implementation plan for converting the single-tenant KOPESS school
> website into a multi-tenant platform with shared database and per-school deployments.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Branch Strategy](#2-branch-strategy)
3. [Phase 1: School Config System](#3-phase-1-school-config-system)
4. [Phase 2: Database Schema Changes](#4-phase-2-database-schema-changes)
5. [Phase 3: File Storage Migration (Supabase Storage)](#5-phase-3-file-storage-migration-supabase-storage)
6. [Phase 4: Scoped Database Layer](#6-phase-4-scoped-database-layer)
7. [Phase 5: API Route Migration](#7-phase-5-api-route-migration)
8. [Phase 6: Authentication Overhaul](#8-phase-6-authentication-overhaul)
9. [Phase 7: Admission Form Revamp](#9-phase-7-admission-form-revamp)
10. [Phase 8: Frontend Migration](#10-phase-8-frontend-migration)
11. [Phase 9: Bug Fixes & Security](#11-phase-9-bug-fixes--security)
12. [Phase 10: Deployment Setup](#12-phase-10-deployment-setup)
13. [Phase 11: First Client Onboarding](#13-phase-11-first-client-onboarding)
14. [File-by-File Change Tracker](#14-file-by-file-change-tracker)
15. [New School Onboarding Checklist](#15-new-school-onboarding-checklist)

---

## 1. Architecture Overview

### What We're Building

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  kopess.edu.np   │  │  schoolb.edu.np  │  │  schoolc.edu.np  │
│  Vercel Project  │  │  Vercel Project  │  │  Vercel Project  │
│  SCHOOL_ID=kopess│  │  SCHOOL_ID=schoolb│ │  SCHOOL_ID=schoolc│
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                      │
         └─────────────┬───────┴──────────────────────┘
                       │
              ┌────────▼────────┐
              │    Supabase     │
              │  ┌────────────┐ │
              │  │ PostgreSQL │ │  ← structured data (events, notices, etc.)
              │  └────────────┘ │
              │  ┌────────────┐ │
              │  │  Storage   │ │  ← files (images, documents) via CDN
              │  │  (Buckets) │ │
              │  └────────────┘ │
              └─────────────────┘
```

### Key Decisions (Already Agreed)

| Decision | Choice | Reason |
|----------|--------|--------|
| Tenancy model | Single DB, shared tables with `schoolId` | Cheapest, simplest, all schools have same schema |
| Deployment | Separate Vercel projects per school, same repo | Independent builds, shared codebase |
| Branding | Hardcoded in `config/school.ts` per school | Fast load, no DB fetch for static content |
| Domain | Custom `.edu.np` per school | Client requirement |
| Codebase | Single repo, `SCHOOL_ID` env var selects config | One fix benefits all schools |
| Admission form | Standardized for all schools (Nepal context) | No per-school customization needed |
| Admin | Each school has own admin(s) scoped by `schoolId` | School manages own content |
| File storage | **Supabase Storage (buckets)** — NOT database blobs | CDN-backed, scalable, 100GB on Pro vs 8GB DB |
| Theming | **CSS Variables + Tailwind** — hex colors in config, injected as CSS vars | Dynamic per school, works with Tailwind purging |
| Layout variants | **Config-driven section swapping** — hero, header, footer styles selectable | Avoids "photocopy template" look across schools |

---

## 2. Branch Strategy

```
main              ← current live demo for pitching (DO NOT TOUCH)
multi-tenant      ← all development work happens here
```

- Create `multi-tenant` branch from `main`
- All work goes into `multi-tenant`
- Vercel production deploys from `main` (pitch demo stays safe)
- When ready: merge `multi-tenant` → `main`

---

## 3. Phase 1: School Config System

### 3.1 Create Config Structure

Create the following folder structure:

```
schools/
├── kopess/
│   ├── config.ts              ← all school metadata
│   ├── academic-calendar.ts   ← academic calendar data
│   └── assets/
│       ├── logo.png
│       ├── hero-video.mp4     (or hero.jpg)
│       ├── hero-video.webm
│       └── calendar/
│           ├── 1.jpg
│           ├── 2.jpg
│           └── ... (6 slides)
```

### 3.2 Config File Schema

**File: `schools/kopess/config.ts`**

```ts
import { SchoolConfig } from "@/types/school";

const config: SchoolConfig = {
  // === IDENTITY ===
  id: "kopess",                              // must match SCHOOL_ID env var
  name: "KOPESS",
  fullName: "Kotdevi Public English Sec. School",
  tagline: "Nurturing Future Leaders",
  description: "Quality education commitment...",
  foundedYear: 1999,

  // === HERO SECTION ===
  hero: {
    type: "video",                           // "video" | "image"
    videoSrc: "/school-assets/hero-video.mp4",
    videoWebmSrc: "/school-assets/hero-video.webm",
    fallbackImage: "/school-assets/juniors1.jpg",
    headline: "KOPESS",
    subheadline: "Nurturing young minds, building bright futures, and creating tomorrow's leaders through innovative education and holistic development.",
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
    address: "Kathmandu, Nepal",
    phones: {
      main: "+977 (01) 5202000",
      admissions: "+977 (01) 5202001",
      emergency: "+977 (01) 5202002",
    },
    emails: {
      info: "info@kopess.edu.np",
      admissions: "admissions@kopess.edu.np",
      principal: "principal@kopess.edu.np",
    },
    officeHours: {
      weekdays: "Sunday - Friday: 10:00 AM - 5:00 PM",
      saturday: "Saturday: Holiday",
    },
    googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=...",
  },

  // === DEPARTMENTS (Contact Page) ===
  departments: [
    { name: "Principal's Office", phone: "...", email: "..." },
    { name: "Admissions Office", phone: "...", email: "..." },
    // ... more departments
  ],

  // === LEADERSHIP TEAM (About Page) ===
  leadership: [
    {
      name: "...",
      role: "Principal",
      qualification: "...",
      image: "/school-assets/principal.jpg",  // optional
    },
    // ... more team members
  ],

  // === MILESTONES (About Page) ===
  milestones: [
    { year: "1999", title: "School established" },
    { year: "2005", title: "First graduation ceremony" },
    // ...
  ],

  // === ACHIEVEMENTS (About Page) ===
  achievements: [
    { year: "2023", title: "Best School in Academic Excellence Award" },
    // ...
  ],

  // === MISSION & VISION (About Page) ===
  mission: "...",
  vision: "...",
  coreValues: ["Excellence", "Integrity", "Innovation", "Community Service"],

  // === ACADEMIC INFO (Academics Page) ===
  academics: {
    programs: [
      {
        level: "Primary (1-5)",
        grades: "Grade 1 - Grade 5",
        subjects: ["English", "Nepali", "Mathematics", "Science", "Social Studies"],
      },
      {
        level: "Lower Secondary (6-8)",
        grades: "Grade 6 - Grade 8",
        subjects: ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Computer"],
      },
      {
        level: "Secondary (9-10)",
        grades: "Grade 9 - Grade 10",
        subjects: ["Compulsory English", "Nepali", "Mathematics", "Science", "Social Studies", "Optional I", "Optional II"],
      },
    ],
    gradingScale: [
      { grade: "A+", range: "90-100%", gpa: "4.0" },
      { grade: "A", range: "80-89%", gpa: "3.6" },
      { grade: "B+", range: "70-79%", gpa: "3.2" },
      { grade: "B", range: "60-69%", gpa: "2.8" },
      { grade: "C+", range: "50-59%", gpa: "2.4" },
      { grade: "C", range: "40-49%", gpa: "2.0" },
      { grade: "D", range: "Below 40%", gpa: "0.0" },
    ],
    assessmentWeights: "Continuous Assessment (40%), Terminal Exam (60%)",
    features: [
      { title: "Small Class Sizes", detail: "20:1 student-teacher ratio" },
      { title: "Computer Lab", detail: "Modern equipment" },
      { title: "Science Labs", detail: "Practical-based learning" },
    ],
  },

  // === FACILITIES (Facilities Page) ===
  facilities: {
    main: [
      {
        name: "Modern Library",
        description: "...",
        icon: "BookOpen",
        highlights: ["10,000+ books", "Digital catalog", "Study rooms"],
      },
      // ... more facilities
    ],
    additional: [
      { name: "Transportation", icon: "Bus", highlights: ["..."] },
      // ...
    ],
    safetyFeatures: ["Fire safety systems", "CCTV monitoring", "..."],
    stats: {
      books: "10,000+",
      labs: "5",
      computers: "50+",
      security: "24/7",
    },
  },

  // === BEYOND ACADEMICS (Others Page) ===
  houses: [
    { name: "Phoenix House", color: "Red", motto: "Rise with Courage", achievements: ["..."] },
    { name: "Eagle House", color: "Blue", motto: "Soar to Heights", achievements: ["..."] },
    // ...
  ],

  clubs: [
    { name: "Drama Club", members: 45 },
    { name: "Science Club", members: 52 },
    // ...
  ],

  extracurriculars: {
    sports: ["Basketball", "Football", "Cricket", "Badminton"],
    arts: ["Painting", "Music", "Dance", "Drama"],
    academic: ["Math Olympiad", "Science Fair", "Quiz Competition"],
    community: ["Environmental Club", "Social Service", "Student Council"],
  },

  alumni: [
    { name: "...", classOf: "2010", achievement: "...", role: "..." },
    // ...
  ],

  // === ADMISSION DATES (Admission Page) ===
  admissionDates: {
    applicationPeriod: "Poush - Falgun 2081",
    assessmentDates: "Chaitra 2081",
    results: "Chaitra 30, 2081",
    enrollmentDeadline: "Baishakh 15, 2082",
  },

  // === SCHOLARSHIPS (Admission Page) ===
  scholarships: [
    { name: "Academic Excellence", discount: "Up to 50% tuition", criteria: "Top performers" },
    { name: "Need-Based", discount: "Up to 30% tuition", criteria: "Financial need" },
    { name: "Sibling", discount: "10% tuition", criteria: "Siblings enrolled" },
  ],

  // === IMPORTANT DATES (Homepage) ===
  upcomingHighlights: [
    { title: "Annual Cultural Festival", date: "Falgun 15-17, 2081" },
    { title: "Parent-Teacher Conference", date: "Chaitra 2, 2081" },
  ],

  // === NEWS ITEMS (Homepage — Hardcoded) ===
  newsItems: [
    { title: "Annual Science Fair", date: "Falgun 1, 2081", category: "Academic" },
    { title: "Admission Open for 2082", date: "Magh 25, 2081", category: "Admission" },
  ],

  // === SEO ===
  seo: {
    titleTemplate: "%s | KOPESS - Nurturing Future Leaders",
    defaultTitle: "KOPESS - Kotdevi Public English Sec. School",
    description: "KOPESS provides quality education...",
    keywords: ["KOPESS", "school in Kathmandu", "best school Nepal"],
    ogImage: "/school-assets/og-image.jpg",
  },

  // === THEME COLORS (Hex values → injected as CSS variables) ===
  colors: {
    primary: "#1e40af",        // main brand color (buttons, links, headers)
    primaryLight: "#3b82f6",   // lighter variant (hover states, backgrounds)
    primaryDark: "#1e3a5f",    // dark variant (top navbar, footer)
    accent: "#f59e0b",         // highlight color (badges, CTAs, attention)
    secondary: "#16a34a",      // secondary actions (success states, icons)
  },

  // === FONT (Google Fonts) ===
  fonts: {
    heading: "Playfair Display",   // or "Poppins", "Montserrat", etc.
    body: "Inter",                 // or "Open Sans", "Lato", etc.
  },

  // === LAYOUT VARIANTS (Visual differentiation per school) ===
  layout: {
    // Hero section — the biggest visual differentiator on the homepage
    heroStyle: "video-fullscreen",
    // Options:
    //   "video-fullscreen"  — current: full-screen video background with overlay text
    //   "image-slider"      — auto-sliding image carousel with text overlay
    //   "split-layout"      — left side text + CTA, right side image/video

    // Header / Navigation style
    headerStyle: "standard",
    // Options:
    //   "standard"          — current: top contact bar + sticky nav below
    //   "transparent"       — nav overlays hero with transparent background, becomes solid on scroll
    //   "centered"          — logo centered, nav items split left/right

    // Footer style
    footerStyle: "full",
    // Options:
    //   "full"              — current: 4-column footer with links, contact, hours, social
    //   "compact"           — 2-column: quick links + contact info only
    //   "minimal"           — single row: copyright + social icons

    // Homepage section order — rearranging sections makes each site feel different
    homeSections: [
      "stats",              // student count, faculty, programs, years
      "features",           // why choose us cards
      "news",               // latest news items
      "events",             // upcoming events
      "cta",                // admission call-to-action
    ],
    // Another school might use:
    // ["features", "stats", "events", "news", "cta"]
    // or skip some: ["features", "events", "cta"]
  },

  // === SOCIAL MEDIA ===
  social: {
    facebook: "https://facebook.com/kopess",
    instagram: "https://instagram.com/kopess",
    youtube: "",
    twitter: "",
  },
};

export default config;
```

### 3.3 Config Loader

**File: `lib/school-config.ts`**

```ts
import { SchoolConfig } from "@/types/school";

let cachedConfig: SchoolConfig | null = null;

export function getSchoolConfig(): SchoolConfig {
  if (cachedConfig) return cachedConfig;

  const schoolId = process.env.SCHOOL_ID;
  if (!schoolId) {
    throw new Error("SCHOOL_ID environment variable is not set");
  }

  // Dynamic import based on SCHOOL_ID
  // At build time, Next.js will resolve this
  try {
    const config = require(`@/schools/${schoolId}/config`).default;
    cachedConfig = config;
    return config;
  } catch {
    throw new Error(`School config not found for: ${schoolId}`);
  }
}
```

### 3.4 TypeScript Type Definition

**File: `types/school.ts`**

Define the full `SchoolConfig` interface matching the schema above. Every field is typed.
This ensures any new school config is validated at build time.

### 3.5 Asset Handling

**Build script / next.config.js adjustment:**

At build time, copy `schools/{SCHOOL_ID}/assets/*` → `public/school-assets/`

This can be done with a simple prebuild script in `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/copy-school-assets.js",
    "build": "prisma generate && next build"
  }
}
```

**`scripts/copy-school-assets.js`:**
- Reads `SCHOOL_ID` from env
- Copies `schools/{SCHOOL_ID}/assets/` → `public/school-assets/`
- Fails build if school folder doesn't exist

---

## 4. Phase 2: Database Schema Changes

### 4.1 New Model: School

```prisma
model School {
  id        String   @id @default(cuid())
  slug      String   @unique    // matches SCHOOL_ID env var: "kopess", "schoolb"
  name      String              // display name: "KOPESS"
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  admins          Admin[]
  events          Event[]
  notices         Notice[]
  galleryImages   GalleryImage[]
  popups          Popup[]
  applications    ApplicationForm[]
  contacts        ContactForm[]
}
```

### 4.2 Modified Models — Add `schoolId` to ALL

Every existing model gets:

```prisma
schoolId  String
school    School @relation(fields: [schoolId], references: [id])
```

**Full updated schema:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model School {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  admins        Admin[]
  events        Event[]
  notices       Notice[]
  galleryImages GalleryImage[]
  popups        Popup[]
  applications  ApplicationForm[]
  contacts      ContactForm[]
}

model Admin {
  id        String   @id @default(cuid())
  username  String
  password  String
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([username, schoolId])  // username unique per school, not globally
}

model ApplicationForm {
  id             String   @id @default(cuid())
  schoolId       String
  school         School   @relation(fields: [schoolId], references: [id])

  // --- Student Info ---
  studentNameEn  String               // Full name in English
  studentNameNp  String?              // Full name in Nepali (Devanagari)
  dobAD          DateTime             // Date of birth (AD)
  dobBS          String?              // Date of birth (BS) — stored as string "2065-01-15"
  gender         String               // Male / Female / Other
  nationality    String  @default("Nepali")
  gradeApplying  String               // "Nursery", "LKG", "UKG", "1", "2", ... "12"
  photo          String?              // Supabase Storage URL

  // --- Father Info ---
  fatherName       String
  fatherPhone      String
  fatherOccupation String?

  // --- Mother Info ---
  motherName       String
  motherPhone      String?
  motherOccupation String?

  // --- Address (Structured Nepal) ---
  province     String
  district     String
  municipality String
  wardNo       String
  tole         String?

  // --- Previous School ---
  previousSchool     String?
  previousClass      String?

  // --- Contact ---
  email        String
  phone        String               // primary contact phone

  // --- Meta ---
  message      String?  @db.Text    // additional message
  status       String   @default("pending")  // pending | reviewed | accepted | rejected
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model ContactForm {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  name      String
  email     String
  phone     String
  subject   String
  message   String   @db.Text
  status    String   @default("unread")  // unread | read | replied
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id])
  title       String
  date        DateTime
  category    String   @default("Other")
  image       String?              // Supabase Storage URL (was: /api/files/id)
  description String?  @db.Text
  highlights  String[] @default([])
  photos      String[] @default([])  // Array of Supabase Storage URLs
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model GalleryImage {
  id        String   @id @default(cuid())
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id])
  imageUrl  String               // Supabase Storage URL (was: /api/files/id)
  caption   String?
  category  String   @default("Other")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Notice {
  id          String   @id @default(cuid())
  schoolId    String
  school      School   @relation(fields: [schoolId], references: [id])
  title       String
  date        DateTime
  category    String   @default("General")
  description String?  @db.Text
  priority    String   @default("normal")
  attachment  String?              // Supabase Storage URL (was: /api/files/id)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Popup {
  id        String    @id @default(cuid())
  schoolId  String
  school    School    @relation(fields: [schoolId], references: [id])
  title     String
  imageUrl  String?              // Supabase Storage URL (was: /api/files/id)
  linkUrl   String?
  startDate DateTime?
  endDate   DateTime?
  isActive  Boolean   @default(true)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

**NOTE: The `UploadedFile` model is REMOVED.** All files now go to Supabase Storage.
Database only stores the public URL string in the relevant model's field.

### 4.3 Migration Strategy

```bash
# On multi-tenant branch:
# 1. Update schema.prisma with all changes above
# 2. Create migration
npx prisma migrate dev --name add-multi-tenancy-remove-file-blobs

# 3. Run seed script to create first School record and link existing data
npx tsx scripts/seed-first-school.ts
```

**`scripts/seed-first-school.ts`:**
1. Create a `School` record with slug "kopess"
2. Update ALL existing rows in every table to set `schoolId` = the new school's ID
3. Create an `Admin` record linked to this school (if not exists)
4. Migrate existing `UploadedFile` blobs → Supabase Storage (see Phase 3)

---

## 5. Phase 3: File Storage Migration (Supabase Storage)

### 5.1 Why This Change

| | Old (DB Blobs) | New (Supabase Storage) |
|---|---|---|
| **Where files live** | `UploadedFile.data` (Bytes in PostgreSQL) | Supabase Storage bucket (S3-compatible) |
| **How files are served** | `/api/files/[id]` route queries DB, returns binary | Direct public URL from Supabase CDN |
| **Storage limit** | 8GB on Supabase Pro (shared with all data) | 100GB on Supabase Pro (dedicated file storage) |
| **Speed** | Slow — DB query + API route per image | Fast — CDN-cached, served from edge |
| **Cost per GB** | Expensive (DB storage) | Cheap (object storage) |
| **Scalability** | DB degrades as files grow | Object storage scales independently |
| **Multi-tenant impact** | Multiple schools = DB explodes | Multiple schools = barely notice |

### 5.2 Supabase Storage Setup

**In Supabase Dashboard:**

1. Go to Storage → Create new bucket
2. Bucket name: `school-uploads`
3. Set as **Public** bucket (images need to be publicly accessible)
4. No file size limit at bucket level (we enforce in code)

**Folder structure inside bucket:**

```
school-uploads/
├── kopess/
│   ├── events/
│   │   ├── 1708123456-science-fair.jpg
│   │   └── 1708123789-sports-day.jpg
│   ├── gallery/
│   │   ├── 1708124000-campus-1.jpg
│   │   └── 1708124100-classroom.jpg
│   ├── notices/
│   │   └── 1708124200-exam-schedule.pdf
│   ├── popups/
│   │   └── 1708124300-admission-open.jpg
│   └── applications/
│       └── 1708124400-student-photo.jpg
├── schoolb/
│   ├── events/
│   ├── gallery/
│   └── ...
```

### 5.3 New File: `lib/storage.ts`

```ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "school-uploads";

// Allowed MIME types
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  ...IMAGE_TYPES,
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

type UploadFolder = "events" | "gallery" | "notices" | "popups" | "applications";

/**
 * Upload an image to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadImage(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string
): Promise<string> {
  // Validate type
  const mimeType = file instanceof File ? file.type : (file as any).type;
  if (!IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`Invalid image type: ${mimeType}. Allowed: ${IMAGE_TYPES.join(", ")}`);
  }

  // Validate size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB`);
  }

  return uploadToStorage(schoolSlug, folder, file, fileName, mimeType);
}

/**
 * Upload a document (PDF, Word, etc.) to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadDocument(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string
): Promise<string> {
  const mimeType = file instanceof File ? file.type : (file as any).type;
  if (!DOCUMENT_TYPES.includes(mimeType)) {
    throw new Error(`Invalid document type: ${mimeType}`);
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error(`Document too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB`);
  }

  return uploadToStorage(schoolSlug, folder, file, fileName, mimeType);
}

/**
 * Core upload function.
 */
async function uploadToStorage(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string,
  contentType: string
): Promise<string> {
  // Sanitize filename and add timestamp to prevent collisions
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const path = `${schoolSlug}/${folder}/${Date.now()}-${sanitized}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType,
      cacheControl: "3600",  // 1 hour cache
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  // Extract the storage path from the full public URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/school-uploads/kopess/events/file.jpg
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const markerIndex = fileUrl.indexOf(marker);

  if (markerIndex === -1) {
    // Not a Supabase Storage URL — might be legacy /api/files/ URL, skip silently
    console.warn(`Not a Supabase Storage URL, skipping delete: ${fileUrl}`);
    return;
  }

  const path = fileUrl.substring(markerIndex + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Delete multiple files from Supabase Storage.
 */
export async function deleteFiles(fileUrls: string[]): Promise<void> {
  const paths: string[] = [];
  const marker = `/storage/v1/object/public/${BUCKET}/`;

  for (const url of fileUrls) {
    const markerIndex = url.indexOf(marker);
    if (markerIndex !== -1) {
      paths.push(url.substring(markerIndex + marker.length));
    }
  }

  if (paths.length > 0) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      console.error(`Failed to delete files: ${error.message}`);
    }
  }
}
```

### 5.4 New Dependency

```bash
npm install @supabase/supabase-js
```

### 5.5 New Environment Variables

```env
# Add to ALL Vercel projects (same value for all since same Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # server-side only, NEVER expose to client
```

> **IMPORTANT:** `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security.
> It must ONLY be used server-side (API routes). The `NEXT_PUBLIC_` prefix is
> intentionally NOT used for this key.

### 5.6 Files to Remove

| File | Reason |
|------|--------|
| `lib/fileUpload.ts` | Replaced entirely by `lib/storage.ts` |
| `app/api/files/[id]/route.ts` | No longer needed — files served directly from Supabase CDN |
| `app/api/upload/route.ts` | Replaced — uploads now go through specific API routes (events, gallery, etc.) |

### 5.7 Migration Script for Existing Files

If there are existing files in the `UploadedFile` table, they need to be migrated
to Supabase Storage before dropping the table.

**`scripts/migrate-files-to-storage.ts`:**

```ts
// 1. Query all UploadedFile records
// 2. For each file:
//    a. Upload file.data blob to Supabase Storage
//    b. Get the new public URL
//    c. Find which Event/Notice/Gallery/Popup references /api/files/{id}
//    d. Update that record's image/imageUrl/attachment field with new URL
// 3. After all migrated, safe to drop UploadedFile table
```

### 5.8 How Each API Route Changes for Storage

**Events (`app/api/events/route.ts`):**
```ts
// Before (current):
const imageUrl = await saveUploadedFile(imageFile);
await prisma.event.create({ data: { ..., image: imageUrl } });

// After:
import { uploadImage, deleteFile } from "@/lib/storage";
const imageUrl = await uploadImage(schoolSlug, "events", imageFile, imageFile.name);
await db.event.create({ data: { ..., image: imageUrl } });

// On delete:
if (event.image) await deleteFile(event.image);
// On update (replacing image):
if (event.image && newImage) await deleteFile(event.image);
```

**Gallery (`app/api/gallery/route.ts`):** Same pattern, folder = "gallery"

**Notices (`app/api/notices/route.ts`):**
```ts
// Uses uploadDocument() instead of uploadImage() for attachments
const attachmentUrl = await uploadDocument(schoolSlug, "notices", file, file.name);
```

**Popups (`app/api/popups/route.ts`):** Same pattern as events, folder = "popups"

**Applications (`app/api/applications/route.ts`):**
```ts
// Student photo upload (optional)
if (photoFile) {
  const photoUrl = await uploadImage(schoolSlug, "applications", photoFile, photoFile.name);
}
```

### 5.9 Frontend Image Display Changes

```tsx
// Before — images served through API route:
<img src="/api/files/cuid123abc" />

// After — images served directly from Supabase CDN:
<img src="https://xxx.supabase.co/storage/v1/object/public/school-uploads/kopess/events/1708123456-science-fair.jpg" />
```

For Next.js Image optimization, update `next.config.js`:

```js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",  // allow Supabase Storage URLs
      },
    ],
  },
};
```

---

## 6. Phase 4: Scoped Database Layer

### 6.1 School ID Resolver

**File: `lib/school.ts`**

```ts
// Resolves the current school from the environment
// Every deployment has SCHOOL_ID set

import prisma from "./db";

let cachedSchoolId: string | null = null;
let cachedSchoolSlug: string | null = null;

export async function getSchoolId(): Promise<string> {
  if (cachedSchoolId) return cachedSchoolId;

  const slug = process.env.SCHOOL_ID;
  if (!slug) throw new Error("SCHOOL_ID env var not set");

  const school = await prisma.school.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!school) throw new Error(`School not found: ${slug}`);

  cachedSchoolId = school.id;
  cachedSchoolSlug = slug;
  return school.id;
}

export function getSchoolSlug(): string {
  const slug = process.env.SCHOOL_ID;
  if (!slug) throw new Error("SCHOOL_ID env var not set");
  return slug;
}
```

### 6.2 Scoped Query Helper

**File: `lib/db-scoped.ts`**

This is the **critical safety layer**. Instead of calling `prisma.event.findMany()` directly, all API routes will use scoped helpers that automatically inject `schoolId`.

```ts
import prisma from "./db";
import { getSchoolId } from "./school";

export async function scopedPrisma() {
  const schoolId = await getSchoolId();

  return {
    schoolId,

    event: {
      findMany: (args?: any) =>
        prisma.event.findMany({
          ...args,
          where: { ...args?.where, schoolId },
        }),
      count: (args?: any) =>
        prisma.event.count({
          ...args,
          where: { ...args?.where, schoolId },
        }),
      create: (args: any) =>
        prisma.event.create({
          ...args,
          data: { ...args.data, schoolId },
        }),
      findUnique: (args: any) =>
        prisma.event.findUnique(args).then((result) => {
          if (result && result.schoolId !== schoolId) return null;
          return result;
        }),
      update: (args: any) => prisma.event.update(args),
      delete: (args: any) => prisma.event.delete(args),
    },

    // ... repeat pattern for: notice, galleryImage, popup,
    //     applicationForm, contactForm
  };
}
```

**Why this matters:** A developer can never accidentally forget the `schoolId` filter. If they use `scopedPrisma()`, tenant isolation is guaranteed.

---

## 7. Phase 5: API Route Migration

### 7.1 Pattern for Every Route

**Before (current):**
```ts
const events = await prisma.event.findMany({ ... });
```

**After:**
```ts
const db = await scopedPrisma();
const events = await db.event.findMany({ ... });
```

### 7.2 Every Route That Needs Changes

| File | Changes |
|------|---------|
| `app/api/applications/route.ts` | Use `scopedPrisma()` for GET and POST. Handle new form fields. Use `uploadImage()` for student photo. |
| `app/api/contacts/route.ts` | Use `scopedPrisma()` for GET, POST, PUT |
| `app/api/events/route.ts` | Use `scopedPrisma()` for GET, POST, PUT, DELETE. Replace `saveUploadedFile()` with `uploadImage()`. Replace `deleteUploadedFile()` with `deleteFile()`. |
| `app/api/events/[id]/route.ts` | Use `scopedPrisma()` for GET, PUT, DELETE |
| `app/api/gallery/route.ts` | Use `scopedPrisma()` for GET, POST, DELETE. Replace file functions with `uploadImage()`/`deleteFile()`. |
| `app/api/gallery/[id]/route.ts` | Use `scopedPrisma()` for GET, PUT, DELETE |
| `app/api/notices/route.ts` | Use `scopedPrisma()` for GET, POST, PUT, DELETE. Replace file functions with `uploadDocument()`/`deleteFile()`. |
| `app/api/notices/[id]/route.ts` | Use `scopedPrisma()` for GET, PUT, DELETE |
| `app/api/popups/route.ts` | Use `scopedPrisma()` for GET, POST. Replace file functions with `uploadImage()`/`deleteFile()`. **ADD AUTH.** |
| `app/api/popups/[id]/route.ts` | Use `scopedPrisma()` for PUT, DELETE. Replace file functions. **ADD AUTH.** |
| `app/api/auth/login/route.ts` | Scope admin lookup by schoolId |
| `app/api/auth/change-password/route.ts` | Scope admin lookup by schoolId |

### 7.3 Routes to DELETE

| File | Reason |
|------|--------|
| `app/api/files/[id]/route.ts` | Files now served directly from Supabase CDN URLs — no proxy needed |
| `app/api/upload/route.ts` | Generic upload endpoint replaced by per-route uploads via `lib/storage.ts` |

---

## 8. Phase 6: Authentication Overhaul

### 8.1 Current State

- Single admin, password-only login (no username field)
- JWT contains `{ role: 'admin' }` — no school identifier
- `verifyAdminPassword()` checks single admin record or env fallback

### 8.2 Required Changes

**JWT payload must include schoolId:**
```ts
// Before
const token = { role: "admin" };

// After
const token = { role: "admin", schoolId: "cuid_of_school" };
```

**Login flow changes (`app/api/auth/login/route.ts`):**
1. Resolve `schoolId` from `SCHOOL_ID` env var
2. Find admin record WHERE `schoolId` matches
3. Verify password against that admin
4. Generate token with `schoolId` in payload

**`lib/auth.ts` changes:**
- `verifyAdminPassword(password)` → `verifyAdminPassword(password, schoolId)`
- `generateToken()` → `generateToken(schoolId)`
- Remove env fallback `ADMIN_PASSWORD_HASH` (all passwords in DB now)
- `isAuthenticated()` should return `{ authenticated: boolean, schoolId: string }`

**`lib/auth-edge.ts` changes:**
- `verifyTokenEdge()` must also extract and return `schoolId` from token

**`middleware.ts` changes:**
- After verifying token, extract `schoolId` and validate it matches `SCHOOL_ID` env
- This prevents a token from school A being used on school B's deployment

### 8.3 Admin Seeding

Each school needs at least one admin created during onboarding:

```ts
// scripts/create-school-admin.ts
// Usage: SCHOOL_ID=kopess npx tsx scripts/create-school-admin.ts

const schoolId = await getSchoolId();
await prisma.admin.create({
  data: {
    username: "admin",
    password: await hashPassword("initial-password-here"),
    schoolId,
  },
});
```

---

## 9. Phase 7: Admission Form Revamp

### 9.1 New Form Fields (Agreed Standard — Nepal Context)

**Section 1: Student Information**
| Field | Type | Required |
|-------|------|----------|
| Student's Full Name (English) | text | Yes |
| Student's Full Name (Nepali) | text | No |
| Date of Birth (AD) | date | Yes |
| Date of Birth (BS) | text | No |
| Gender | select: Male/Female/Other | Yes |
| Nationality | text (default: Nepali) | Yes |
| Grade Applying For | select: Nursery/LKG/UKG/1-12 | Yes |
| Student Photo | file upload (→ Supabase Storage) | No |

**Section 2: Parent/Guardian Information**
| Field | Type | Required |
|-------|------|----------|
| Father's Full Name | text | Yes |
| Father's Phone | tel | Yes |
| Father's Occupation | text | No |
| Mother's Full Name | text | Yes |
| Mother's Phone | tel | No |
| Mother's Occupation | text | No |

**Section 3: Address (Nepal Structure)**
| Field | Type | Required |
|-------|------|----------|
| Province | select: 1-7 | Yes |
| District | select (filtered by province) | Yes |
| Municipality | text | Yes |
| Ward No. | text | Yes |
| Tole/Street | text | No |

**Section 4: Previous Education**
| Field | Type | Required |
|-------|------|----------|
| Previous School Name | text | No |
| Last Class Attended | text | No |

**Section 5: Contact**
| Field | Type | Required |
|-------|------|----------|
| Email Address | email | Yes |
| Phone (Primary) | tel | Yes |

**Section 6: Additional**
| Field | Type | Required |
|-------|------|----------|
| Message / Additional Info | textarea | No |

**Grade Dropdown Options:**
```
Nursery, LKG, UKG, Grade 1, Grade 2, Grade 3, Grade 4, Grade 5,
Grade 6, Grade 7, Grade 8, Grade 9, Grade 10, Grade 11, Grade 12
```

**Province Options (Nepal):**
```
1 - Koshi Pradesh
2 - Madhesh Pradesh
3 - Bagmati Pradesh
4 - Gandaki Pradesh
5 - Lumbini Pradesh
6 - Karnali Pradesh
7 - Sudurpashchim Pradesh
```

### 9.2 Files to Change

- `prisma/schema.prisma` — `ApplicationForm` model (already defined in Phase 2)
- `app/admission/page.tsx` — complete form rewrite with new fields
- `app/api/applications/route.ts` — update POST handler for new fields + photo upload via `uploadImage()`
- `app/admin/dashboard/applications/page.tsx` — update admin view to show new fields

### 9.3 Nepal District Data

Create a helper file with province → district mapping:

**File: `lib/nepal-data.ts`**
```ts
export const provinces = [ ... ];
export const districtsByProvince: Record<string, string[]> = {
  "Koshi Pradesh": ["Taplejung", "Panchthar", "Ilam", ...],
  "Bagmati Pradesh": ["Kathmandu", "Lalitpur", "Bhaktapur", ...],
  // ... all 77 districts
};
```

---

## 10. Phase 8: Frontend Migration — Theming, Layout Variants & Branding

### 10.0 Theming System (CSS Variables + Tailwind)

**The Problem:** Tailwind purges unused classes at build time. You can't do `bg-${config.colors.primary}`.
Dynamic class names like `bg-blue-600` constructed from variables will be stripped out.

**The Solution:** CSS Custom Properties (CSS variables) injected at the root, consumed by Tailwind.

#### Step 1: Config stores hex color values (already done above)

```ts
// schools/kopess/config.ts
colors: {
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  primaryDark: "#1e3a5f",
  accent: "#f59e0b",
  secondary: "#16a34a",
}
```

#### Step 2: Root layout injects CSS variables

```tsx
// app/layout.tsx
import { getSchoolConfig } from "@/lib/school-config";
const config = getSchoolConfig();

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      style={{
        '--color-primary': config.colors.primary,
        '--color-primary-light': config.colors.primaryLight,
        '--color-primary-dark': config.colors.primaryDark,
        '--color-accent': config.colors.accent,
        '--color-secondary': config.colors.secondary,
      } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
```

#### Step 3: Tailwind config maps CSS variables to utility classes

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        school: {
          primary: 'var(--color-primary)',
          'primary-light': 'var(--color-primary-light)',
          'primary-dark': 'var(--color-primary-dark)',
          accent: 'var(--color-accent)',
          secondary: 'var(--color-secondary)',
        },
      },
    },
  },
};
```

#### Step 4: Components use `school-*` color classes

```tsx
// BEFORE (hardcoded blue — same for every school):
<button className="bg-blue-600 hover:bg-blue-700 text-white">Apply Now</button>
<div className="bg-blue-900 text-white">Top Navbar</div>
<h2 className="text-blue-600">Section Title</h2>

// AFTER (dynamic per school — reads from CSS variables):
<button className="bg-school-primary hover:bg-school-primary-dark text-white">Apply Now</button>
<div className="bg-school-primary-dark text-white">Top Navbar</div>
<h2 className="text-school-primary">Section Title</h2>
```

**Result:** Same class names across all schools, but each school renders its own brand colors.

| School | primary | primaryDark | accent |
|--------|---------|-------------|--------|
| KOPESS | Blue `#1e40af` | Navy `#1e3a5f` | Gold `#f59e0b` |
| School B | Red `#dc2626` | Maroon `#7f1d1d` | Silver `#9ca3af` |
| School C | Green `#16a34a` | Dark Green `#14532d` | Orange `#ea580c` |

#### Files changed for theming:
- `tailwind.config.js` — add `school` color namespace
- `app/layout.tsx` — inject CSS variables from config
- `app/globals.css` — optional: add CSS variable fallbacks
- **ALL components/pages** — replace hardcoded `blue-600`, `blue-900`, etc. with `school-primary`, `school-primary-dark`, etc.

---

### 10.0.1 Font System (Google Fonts)

Each school can have different font pairings:

```ts
// schools/kopess/config.ts
fonts: {
  heading: "Playfair Display",
  body: "Inter",
}
```

**In `app/layout.tsx`:**

```tsx
import { getSchoolConfig } from "@/lib/school-config";
const config = getSchoolConfig();

// Dynamically load Google Fonts based on config
const fontUrl = `https://fonts.googleapis.com/css2?family=${config.fonts.heading.replace(/ /g, '+')}:wght@400;600;700&family=${config.fonts.body.replace(/ /g, '+')}:wght@300;400;500;600&display=swap`;

// In <head>:
<link href={fontUrl} rel="stylesheet" />

// In <html> style (alongside colors):
style={{
  '--font-heading': `'${config.fonts.heading}', serif`,
  '--font-body': `'${config.fonts.body}', sans-serif`,
  ...colorVars,
}}
```

**In `tailwind.config.js`:**
```js
fontFamily: {
  heading: 'var(--font-heading)',
  body: 'var(--font-body)',
},
```

**Usage:**
```tsx
<h1 className="font-heading text-3xl">School Name</h1>
<p className="font-body text-base">Description text</p>
```

---

### 10.0.2 Layout Variant System (Avoiding "Photocopy Template")

The config defines which variant of each major section to render.
Each variant is a separate component. The page dynamically picks the right one.

**Config:**
```ts
layout: {
  heroStyle: "video-fullscreen",   // | "image-slider" | "split-layout"
  headerStyle: "standard",         // | "transparent" | "centered"
  footerStyle: "full",             // | "compact" | "minimal"
  homeSections: ["stats", "features", "news", "events", "cta"],
}
```

**Component structure:**

```
components/
├── heroes/
│   ├── HeroVideoFullscreen.tsx     ← current design
│   ├── HeroImageSlider.tsx         ← image carousel variant
│   └── HeroSplitLayout.tsx         ← text left, image right
├── headers/
│   ├── HeaderStandard.tsx          ← current design
│   ├── HeaderTransparent.tsx       ← overlay on hero
│   └── HeaderCentered.tsx          ← logo center, nav split
├── footers/
│   ├── FooterFull.tsx              ← current design
│   ├── FooterCompact.tsx           ← 2-column
│   └── FooterMinimal.tsx           ← single row
├── home-sections/
│   ├── StatsSection.tsx
│   ├── FeaturesSection.tsx
│   ├── NewsSection.tsx
│   ├── EventsSection.tsx
│   └── CTASection.tsx
```

**Dynamic rendering in pages:**

```tsx
// components/HeroSection.tsx (wrapper that picks the right variant)
import { getSchoolConfig } from "@/lib/school-config";
import HeroVideoFullscreen from "./heroes/HeroVideoFullscreen";
import HeroImageSlider from "./heroes/HeroImageSlider";
import HeroSplitLayout from "./heroes/HeroSplitLayout";

const heroComponents = {
  "video-fullscreen": HeroVideoFullscreen,
  "image-slider": HeroImageSlider,
  "split-layout": HeroSplitLayout,
};

export default function HeroSection() {
  const config = getSchoolConfig();
  const HeroComponent = heroComponents[config.layout.heroStyle];
  return <HeroComponent config={config} />;
}
```

```tsx
// app/page.tsx (homepage with configurable section order)
import { getSchoolConfig } from "@/lib/school-config";
import StatsSection from "@/components/home-sections/StatsSection";
import FeaturesSection from "@/components/home-sections/FeaturesSection";
import NewsSection from "@/components/home-sections/NewsSection";
import EventsSection from "@/components/home-sections/EventsSection";
import CTASection from "@/components/home-sections/CTASection";

const sectionComponents: Record<string, React.FC> = {
  stats: StatsSection,
  features: FeaturesSection,
  news: NewsSection,
  events: EventsSection,
  cta: CTASection,
};

export default function HomePage() {
  const config = getSchoolConfig();

  return (
    <>
      <HeroSection />
      {config.layout.homeSections.map((section) => {
        const Section = sectionComponents[section];
        return Section ? <Section key={section} /> : null;
      })}
    </>
  );
}
```

**Visual impact of combinations:**

```
School A: video hero + standard header + full footer + [stats, features, events, cta]
School B: slider hero + transparent header + minimal footer + [features, stats, news, cta]
School C: split hero + centered header + compact footer + [features, events, stats, cta]
```

3 hero x 3 header x 3 footer x varied section order = **dozens of unique-looking sites**

#### Implementation Priority:

| Variant | When to Build | Notes |
|---------|---------------|-------|
| `video-fullscreen` hero | Now (exists) | Current design, refactor into variant component |
| `standard` header | Now (exists) | Current design, refactor into variant component |
| `full` footer | Now (exists) | Current design, refactor into variant component |
| `image-slider` hero | Before 2nd client | High visual impact, easy to build |
| `split-layout` hero | Before 3rd client | Different layout feel |
| `transparent` header | Before 2nd client | Popular modern look |
| `centered` header | Before 3rd client | Elegant, classic feel |
| `compact` footer | Before 2nd client | Quick to build |
| `minimal` footer | Before 3rd client | Quick to build |

**For the first client:** Use existing designs, just refactor them into the variant component structure.
**For the second client:** Build 1 new hero + 1 new header + 1 new footer variant.
**Each new variant built benefits ALL future clients.**

---

### 10.1 Files That Need Branding Extraction

Every file below currently has hardcoded school values that must be replaced with `getSchoolConfig()` or imports from the config.

**Components (refactor into variant system + read from config):**

| File | Change |
|------|--------|
| `components/TopNavbar.tsx` | Read phone, email, hours from config. Replace `blue-900` → `school-primary-dark` |
| `components/Header.tsx` | Becomes variant wrapper → picks `headers/HeaderStandard.tsx` etc. based on `config.layout.headerStyle`. Replace `blue-600` → `school-primary` |
| `components/Footer.tsx` | Becomes variant wrapper → picks `footers/FooterFull.tsx` etc. based on `config.layout.footerStyle`. Replace `gray-900` → `school-primary-dark` |
| `components/HeroSection.tsx` | Becomes variant wrapper → picks `heroes/HeroVideoFullscreen.tsx` etc. based on `config.layout.heroStyle`. Replace `blue-600` → `school-primary`, `yellow-400` → `school-accent` |
| `components/CalendarCarousel.tsx` | Read image paths from config (move to `/school-assets/calendar/`) |
| **NEW** `components/heroes/HeroVideoFullscreen.tsx` | Extracted from current HeroSection.tsx |
| **NEW** `components/heroes/HeroImageSlider.tsx` | Build before 2nd client |
| **NEW** `components/heroes/HeroSplitLayout.tsx` | Build before 3rd client |
| **NEW** `components/headers/HeaderStandard.tsx` | Extracted from current Header.tsx |
| **NEW** `components/headers/HeaderTransparent.tsx` | Build before 2nd client |
| **NEW** `components/headers/HeaderCentered.tsx` | Build before 3rd client |
| **NEW** `components/footers/FooterFull.tsx` | Extracted from current Footer.tsx |
| **NEW** `components/footers/FooterCompact.tsx` | Build before 2nd client |
| **NEW** `components/footers/FooterMinimal.tsx` | Build before 3rd client |
| **NEW** `components/home-sections/StatsSection.tsx` | Extracted from current page.tsx |
| **NEW** `components/home-sections/FeaturesSection.tsx` | Extracted from current page.tsx |
| **NEW** `components/home-sections/NewsSection.tsx` | Extracted from current page.tsx |
| **NEW** `components/home-sections/EventsSection.tsx` | Extracted from current page.tsx |
| **NEW** `components/home-sections/CTASection.tsx` | Extracted from current page.tsx |

**Pages (read from config + replace all hardcoded colors):**

| File | Hardcoded Values to Extract | Color Replacements |
|------|----------------------------|-------------------|
| `app/page.tsx` | School name, stats, features, news items, upcoming events. **Refactor sections into `home-sections/` components with configurable order.** | `blue-600`→`school-primary`, `green-600`→`school-secondary`, `yellow-600`→`school-accent` |
| `app/about/page.tsx` | School name, founded year, history, leadership team, milestones, achievements, mission, vision, core values, principal's quote | `blue-600`→`school-primary`, `green-600`→`school-secondary` |
| `app/academics/page.tsx` | Programs, subjects, exam schedule, grading scale, assessment methods, calendar, achievement stats | `green-600`→`school-primary` |
| `app/admission/page.tsx` | **FULL REWRITE (Phase 7)** | All colors → `school-*` |
| `app/contact/page.tsx` | All contact info, departments, Google Maps URL, transportation info, FAQ, hours | `cyan-600`→`school-primary` |
| `app/facilities/page.tsx` | School name, all facilities, amenities, safety features, stats | `violet-600`→`school-primary` |
| `app/others/page.tsx` | School name, houses, clubs, extracurriculars, alumni | `emerald-600`→`school-primary` |
| `app/events/page.tsx` | Category stats (hardcoded "8 events/year" etc.), past events | `indigo-600`→`school-primary` |
| `app/notices/page.tsx` | School name in subtitle | `teal-600`→`school-primary` |

**Admin Pages (minimal changes — mostly just "KOPESS" → config.name):**

| File | Changes |
|------|---------|
| `app/admin/login/page.tsx` | School name "KOPESS Management Portal" |
| `app/admin/layout.tsx` | "KOPESS" in sidebar |
| `app/admin/dashboard/layout.tsx` | "KOPESS" in sidebar header |
| `app/admin/dashboard/page.tsx` | Greeting message (minor) |
| `app/admin/dashboard/applications/page.tsx` | Update table columns for new form fields |

### 10.2 How Components Read Config

For **server components** (like Footer.tsx):
```ts
import { getSchoolConfig } from "@/lib/school-config";
const config = getSchoolConfig();
```

For **client components** (most pages):
- Option A: Pass config as props from a server component parent
- Option B: Import directly (works because config is a static file bundled at build time)

**Option B is simpler** — since the config file is a plain TypeScript object with no async operations, it gets bundled into the client JS at build time. No runtime fetch needed.

```tsx
// Any client component:
import { getSchoolConfig } from "@/lib/school-config";
const config = getSchoolConfig();

export default function Header() {
  return <h1>{config.name}</h1>;
}
```

---

## 11. Phase 9: Bug Fixes & Security

### 11.1 Security Issues Found (Fix During Migration)

| Issue | File | Fix |
|-------|------|-----|
| **Popup POST/PUT/DELETE have NO auth** | `app/api/popups/route.ts`, `app/api/popups/[id]/route.ts` | Add `isAuthenticated()` check |
| **Inconsistent response format** | Popup routes | Standardize to `{ success, data }` wrapper |

### 11.2 Cross-Tenant Safety Checks

1. **Middleware token validation** — token's `schoolId` must match deployment's `SCHOOL_ID`
2. **API write operations** — verify record belongs to school before update/delete
3. **Supabase Storage paths** — files are organized by school slug, so cross-tenant file access is prevented by folder structure
4. **Admin login** — only find admin records matching the school

### 11.3 Supabase Storage Security

- Bucket is public (read) — images need to be publicly viewable on the website
- Uploads only happen server-side via `SUPABASE_SERVICE_ROLE_KEY` — no client-side uploads
- File paths are namespaced by school slug — `kopess/events/...` can't overwrite `schoolb/events/...`
- File type and size validation enforced in `lib/storage.ts` before upload

### 11.4 Session Timeout

Currently 2 minutes — confirm with client if this is appropriate or should be increased (e.g., 15-30 minutes for daily admin use).

---

## 12. Phase 10: Deployment Setup

### 12.1 Environment Variables per Vercel Project

Each school's Vercel project needs:

```env
# Database (SAME for all schools — same Supabase project)
DATABASE_URL=postgresql://...@supabase.../postgres?pgbouncer=true
DIRECT_URL=postgresql://...@supabase.../postgres

# Supabase Storage (SAME for all schools — same Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# School-specific
SCHOOL_ID=kopess
JWT_SECRET=<unique-per-school-for-security>
```

> **Important:** Use a DIFFERENT `JWT_SECRET` per school. This prevents a token from school A
> working on school B's deployment even if someone tries to use it.

### 12.2 Supabase Project Setup (One-Time)

1. Go to Supabase Dashboard → Storage
2. Create bucket: `school-uploads` (public)
3. Note down `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API

### 12.3 Vercel Project Setup Steps (Per School)

1. Go to Vercel dashboard → "New Project"
2. Import the same GitHub repo
3. Set environment variables (above)
4. Set custom domain (e.g., `kopess.edu.np`)
5. Deploy

### 12.4 Database Migration

Migrations only need to run ONCE since all schools share the same DB:

```bash
# Run from any machine with DIRECT_URL set
npx prisma migrate deploy
```

---

## 13. Phase 11: First Client Onboarding (KOPESS)

### Step-by-Step

1. **Create school record in DB:**
   ```sql
   INSERT INTO "School" (id, slug, name, "isActive")
   VALUES (cuid(), 'kopess', 'KOPESS', true);
   ```

2. **Create admin for the school:**
   ```bash
   SCHOOL_ID=kopess npx tsx scripts/create-school-admin.ts
   ```

3. **Fill in `schools/kopess/config.ts`** with real school data:
   - Get real contact info, leadership team, facilities from the client
   - Get their logo, hero image/video, calendar images
   - Get mission/vision statements
   - Get admission dates for current year

4. **Place assets in `schools/kopess/assets/`**

5. **Migrate existing data** (if any events/notices already exist):
   ```bash
   npx tsx scripts/seed-first-school.ts
   ```

6. **Migrate existing file blobs to Supabase Storage** (if any uploaded files exist):
   ```bash
   npx tsx scripts/migrate-files-to-storage.ts
   ```

7. **Create Vercel project, set env vars, deploy**

8. **Set up `.edu.np` domain** (registration + DNS)

9. **Hand over admin credentials to client**

10. **Walk client through admin dashboard**

---

## 14. File-by-File Change Tracker

### New Files to Create

| File | Purpose |
|------|---------|
| **Config & Types** | |
| `types/school.ts` | SchoolConfig TypeScript interface (includes colors, fonts, layout) |
| `lib/school-config.ts` | Config loader (reads from schools/ folder) |
| `lib/school.ts` | School ID resolver (DB lookup) + school slug helper |
| `lib/db-scoped.ts` | Tenant-scoped Prisma wrapper |
| `lib/storage.ts` | **Supabase Storage upload/delete helpers** |
| `lib/nepal-data.ts` | Province/District data for admission form |
| **School Config** | |
| `schools/kopess/config.ts` | KOPESS school configuration (colors, fonts, layout, content) |
| `schools/kopess/assets/calendar/` | Scanned calendar images (1.jpg, 2.jpg, ... N.jpg) |
| `schools/kopess/assets/` | Logo, hero, calendar images |
| **Component Variants (Hero)** | |
| `components/heroes/HeroVideoFullscreen.tsx` | Current hero design extracted as variant |
| `components/heroes/HeroImageSlider.tsx` | Image carousel hero (build before 2nd client) |
| `components/heroes/HeroSplitLayout.tsx` | Split layout hero (build before 3rd client) |
| **Component Variants (Header)** | |
| `components/headers/HeaderStandard.tsx` | Current header design extracted as variant |
| `components/headers/HeaderTransparent.tsx` | Transparent overlay header (build before 2nd client) |
| `components/headers/HeaderCentered.tsx` | Centered logo header (build before 3rd client) |
| **Component Variants (Footer)** | |
| `components/footers/FooterFull.tsx` | Current footer design extracted as variant |
| `components/footers/FooterCompact.tsx` | 2-column footer (build before 2nd client) |
| `components/footers/FooterMinimal.tsx` | Single-row footer (build before 3rd client) |
| **Homepage Sections** | |
| `components/home-sections/StatsSection.tsx` | Stats section extracted from page.tsx |
| `components/home-sections/FeaturesSection.tsx` | Features section extracted from page.tsx |
| `components/home-sections/NewsSection.tsx` | News section extracted from page.tsx |
| `components/home-sections/EventsSection.tsx` | Events section extracted from page.tsx |
| `components/home-sections/CTASection.tsx` | CTA section extracted from page.tsx |
| **Scripts** | |
| `scripts/copy-school-assets.js` | Build script to copy assets |
| `scripts/seed-first-school.ts` | Migration script for existing data |
| `scripts/create-school-admin.ts` | Script to create school admin |
| `scripts/migrate-files-to-storage.ts` | **One-time script to move DB blobs → Supabase Storage** |

### Existing Files to Modify

| File | Type of Change |
|------|----------------|
| `prisma/schema.prisma` | Add School model, add schoolId to all models, update ApplicationForm fields, **REMOVE UploadedFile model** |
| `lib/auth.ts` | Scope admin by schoolId, include schoolId in JWT |
| `lib/auth-edge.ts` | Extract schoolId from JWT token |
| `middleware.ts` | Validate token schoolId matches SCHOOL_ID env |
| `app/api/applications/route.ts` | Use scopedPrisma, handle new form fields, use `uploadImage()` for student photo |
| `app/api/contacts/route.ts` | Use scopedPrisma |
| `app/api/events/route.ts` | Use scopedPrisma, **replace `saveUploadedFile()`→`uploadImage()`**, **replace `deleteUploadedFile()`→`deleteFile()`** |
| `app/api/events/[id]/route.ts` | Use scopedPrisma, update file handling |
| `app/api/gallery/route.ts` | Use scopedPrisma, **replace file functions with `uploadImage()`/`deleteFile()`** |
| `app/api/gallery/[id]/route.ts` | Use scopedPrisma, update file handling |
| `app/api/notices/route.ts` | Use scopedPrisma, **replace file functions with `uploadDocument()`/`deleteFile()`** |
| `app/api/notices/[id]/route.ts` | Use scopedPrisma, update file handling |
| `app/api/popups/route.ts` | Use scopedPrisma, replace file functions, **ADD AUTH** |
| `app/api/popups/[id]/route.ts` | Use scopedPrisma, replace file functions, **ADD AUTH** |
| `app/api/auth/login/route.ts` | Scope admin lookup by schoolId |
| `app/api/auth/change-password/route.ts` | Scope admin lookup by schoolId |
| `tailwind.config.js` | **Add `school` color namespace using CSS variables, add `font-heading`/`font-body` font families** |
| `app/layout.tsx` | **Inject CSS variables (colors + fonts) from school config onto `<html>` element** |
| `components/TopNavbar.tsx` | Read from config, replace `blue-900` → `school-primary-dark` |
| `components/Header.tsx` | **Refactor into variant wrapper** → delegates to `headers/HeaderStandard.tsx` etc. Replace `blue-600` → `school-primary` |
| `components/Footer.tsx` | **Refactor into variant wrapper** → delegates to `footers/FooterFull.tsx` etc. Replace `gray-900` → `school-primary-dark` |
| `components/HeroSection.tsx` | **Refactor into variant wrapper** → delegates to `heroes/HeroVideoFullscreen.tsx` etc. Replace `blue-600` → `school-primary`, `yellow-400` → `school-accent` |
| `components/CalendarCarousel.tsx` | Read image paths from config |
| `app/page.tsx` | Read from config, **refactor into configurable section order using `home-sections/` components**. Replace all hardcoded colors → `school-*` |
| `app/about/page.tsx` | Read from config, replace `blue-600` → `school-primary` |
| `app/academics/page.tsx` | Read from config, replace `green-600` → `school-primary` |
| `app/admission/page.tsx` | **FULL REWRITE** — new form fields + student photo upload to Supabase Storage + `school-*` colors |
| `app/contact/page.tsx` | Read from config, replace `cyan-600` → `school-primary` |
| `app/facilities/page.tsx` | Read from config, replace `violet-600` → `school-primary` |
| `app/others/page.tsx` | Read from config, replace `emerald-600` → `school-primary` |
| `app/events/page.tsx` | Read from config, replace `indigo-600` → `school-primary` |
| `app/notices/page.tsx` | Read from config, replace `teal-600` → `school-primary` |
| `app/admin/login/page.tsx` | Read from config for school name, replace `blue-600` → `school-primary` |
| `app/admin/layout.tsx` | Read from config for school name, replace `blue-600` → `school-primary` |
| `app/admin/dashboard/layout.tsx` | Read from config for school name, replace `blue-600` → `school-primary` |
| `app/admin/dashboard/applications/page.tsx` | Update for new form fields |
| `package.json` | Add prebuild script, **add `@supabase/supabase-js` dependency** |
| `next.config.js` | **Replace `images.pexels.com` with `*.supabase.co`** for remote image optimization |

### Files to DELETE

| File | Reason |
|------|--------|
| `lib/fileUpload.ts` | **Replaced by `lib/storage.ts`** — no more DB blob storage |
| `app/api/files/[id]/route.ts` | **No longer needed** — files served directly from Supabase CDN URLs |
| `app/api/upload/route.ts` | **No longer needed** — uploads handled per-route via `lib/storage.ts` |

### Files That Stay Unchanged

| File | Reason |
|------|--------|
| `components/PopupNotice.tsx` | Already fetches from API, no hardcoded values |
| `components/SessionManager.tsx` | Session logic is universal |
| `components/ScrollToTop.tsx` | No school-specific content (but replace `blue-600` → `school-primary`) |
| `lib/db.ts` | Prisma singleton — no changes needed |
| `app/globals.css` | Global styles — may add CSS variable fallbacks |

---

## 15. New School Onboarding Checklist

When a new school signs up, follow this checklist:

```
[ ] 1. Get school info from client:
      - School name (English + Nepali)
      - Logo (PNG, high quality)
      - Brand colors (primary, accent — ask for school letterhead/uniform colors)
      - Hero image or video
      - Contact details (phone, email, address)
      - Leadership team (names, roles, photos)
      - Mission & Vision statements
      - Facilities list
      - Academic programs offered
      - Admission dates
      - Academic calendar images
      - Any other page content

[ ] 1b. Choose design variants for the school:
      - Hero style: video-fullscreen / image-slider / split-layout
      - Header style: standard / transparent / centered
      - Footer style: full / compact / minimal
      - Font pairing: heading + body fonts
      - Homepage section order

[ ] 2. Create school folder:
      schools/{slug}/config.ts
      schools/{slug}/academic-calendar.ts
      schools/{slug}/assets/ (logo, hero, calendar images)

[ ] 3. Create DB records:
      - Run: SCHOOL_ID={slug} npx tsx scripts/create-school.ts
      - This creates School row + Admin user

[ ] 4. Create Vercel project:
      - Import same repo
      - Set env vars: SCHOOL_ID, DATABASE_URL, DIRECT_URL, JWT_SECRET,
        NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
      - Deploy

[ ] 5. Set up domain:
      - Register .edu.np (needs registration certificate + cover letter)
      - Point DNS to Vercel
      - Add domain in Vercel project settings

[ ] 6. Verify:
      - Public pages show correct branding and colors
      - Correct hero/header/footer variant rendering
      - Fonts loading correctly
      - Admin login works
      - CRUD operations work (events, notices, gallery, popups)
      - File uploads go to Supabase Storage under correct school folder
      - Data is isolated (no other school's data visible)
      - Images load fast (served from Supabase CDN)

[ ] 7. Hand off:
      - Share admin credentials with client
      - Walk through admin panel
      - Provide basic training
```

---

## Implementation Order (Priority)

| Priority | Phase | Estimated Effort | Dependency |
|----------|-------|-----------------|------------|
| 1 | Branch setup | 5 min | None |
| 2 | Phase 2: Schema changes | 1-2 hours | None |
| 3 | Phase 1: Config system (includes colors, fonts, layout config) | 2-3 hours | None |
| 4 | Phase 3: Storage migration | 2-3 hours | Phase 2 |
| 5 | Phase 4: Scoped DB layer | 1-2 hours | Phase 2 |
| 6 | Phase 6: Auth overhaul | 2-3 hours | Phase 2, 4 |
| 7 | Phase 5: API migration | 3-4 hours | Phase 3, 4, 6 |
| 8 | Phase 8: Frontend — theming (CSS vars + Tailwind) | 2-3 hours | Phase 1 |
| 9 | Phase 8: Frontend — variant components (extract hero/header/footer/sections) | 3-4 hours | Phase 8a |
| 10 | Phase 8: Frontend — branding extraction (replace hardcoded text) | 3-4 hours | Phase 1 |
| 11 | Phase 7: Admission form | 3-4 hours | Phase 2, 3, 5 |
| 10 | Phase 9: Security fixes | 1-2 hours | Phase 5 |
| 12 | Phase 9: Security fixes | 1-2 hours | Phase 5 |
| 13 | Phase 10: Deployment | 1-2 hours | All above |
| 14 | Phase 11: Client onboarding | 1-2 hours | All above |

**Total estimated effort: ~26-38 hours of focused development**

### Post-First-Client: Build Additional Variants

| Variant | Effort | Build Before |
|---------|--------|-------------|
| `image-slider` hero | 2-3 hours | 2nd client |
| `transparent` header | 1-2 hours | 2nd client |
| `compact` footer | 1 hour | 2nd client |
| `split-layout` hero | 2-3 hours | 3rd client |
| `centered` header | 1-2 hours | 3rd client |
| `minimal` footer | 1 hour | 3rd client |

Each new variant takes 1-3 hours and benefits ALL future clients.

---

*This blueprint was created on 2026-02-17 and last updated on 2026-02-18 with theming system (CSS variables),
font system (Google Fonts), and layout variant system (hero/header/footer/section variants).
It is the single source of truth for the multi-tenant migration.*
