import { PrismaClient } from '@prisma/client';

// Export Prisma types
export type {
  Event,
  EventCategory,
  Notice,
  NoticeCategory,
  NoticePriority,
  GalleryImage,
  GalleryCategory,
  ApplicationForm,
  ApplicationStatus,
  ContactForm,
  ContactStatus,
} from '@prisma/client';

// Global type for Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

export {};
