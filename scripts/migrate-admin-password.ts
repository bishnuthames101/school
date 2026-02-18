/**
 * Create or migrate admin user for a school.
 *
 * Usage:
 *   SCHOOL_ID=kopess npx tsx scripts/migrate-admin-password.ts
 *
 * Requires ADMIN_PASSWORD_HASH in .env
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function migrateAdminPassword() {
  try {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;
    const schoolSlug = process.env.SCHOOL_ID;

    if (!passwordHash) {
      console.error('ERROR: ADMIN_PASSWORD_HASH not found in environment variables');
      process.exit(1);
    }

    if (!schoolSlug) {
      console.error('ERROR: SCHOOL_ID not found in environment variables');
      process.exit(1);
    }

    // Find the school
    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
    });

    if (!school) {
      console.error(`ERROR: School "${schoolSlug}" not found. Run seed-first-school.ts first.`);
      process.exit(1);
    }

    // Check if admin already exists for this school
    const existingAdmin = await prisma.admin.findFirst({
      where: { schoolId: school.id },
    });

    if (existingAdmin) {
      console.log('Admin user already exists for this school');
      console.log('  Username:', existingAdmin.username);
      console.log('  Created:', existingAdmin.createdAt);
      console.log('\nSkipping — admin already exists');
      return;
    }

    // Create admin user linked to this school
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: passwordHash,
        schoolId: school.id,
      },
    });

    console.log('Successfully created admin user');
    console.log('  Username:', admin.username);
    console.log('  School:', schoolSlug);
    console.log('  Created:', admin.createdAt);
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateAdminPassword()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFailed:', error);
    process.exit(1);
  });
