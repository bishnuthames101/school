import { PrismaClient } from '@prisma/client';

// Export Prisma types
export type {
  Event,
  Notice,
  GalleryImage,
  ApplicationForm,
  ContactForm,
  School,
  Admin,
  Popup,
} from '@prisma/client';

// Global type for Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

export {};
