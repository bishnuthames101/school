import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const prisma = new PrismaClient();

async function migrateAdminPassword() {
  try {
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!passwordHash) {
      console.error('ERROR: ADMIN_PASSWORD_HASH not found in environment variables');
      console.log('Please ensure .env.local contains ADMIN_PASSWORD_HASH');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('✓ Admin user already exists in database');
      console.log('  Username:', existingAdmin.username);
      console.log('  Created:', existingAdmin.createdAt);
      console.log('\nSkipping migration - admin already exists');
      return;
    }

    // Create admin user with password from env
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: passwordHash,
      },
    });

    console.log('✓ Successfully migrated admin password to database');
    console.log('  Username:', admin.username);
    console.log('  Created:', admin.createdAt);
    console.log('\nYou can now change the password from the admin dashboard settings page');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateAdminPassword()
  .then(() => {
    console.log('\nMigration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
