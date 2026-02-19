/**
 * Creates (or skips if existing) the admin user for a school deployment.
 *
 * Usage:
 *   SCHOOL_ID=kopess ADMIN_PASSWORD=secret123 npx tsx scripts/create-school-admin.ts
 *   SCHOOL_ID=kopess ADMIN_USERNAME=myadmin ADMIN_PASSWORD=secret123 npx tsx scripts/create-school-admin.ts
 *
 * ADMIN_USERNAME defaults to "admin" if not set.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const schoolSlug = process.env.SCHOOL_ID;
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!schoolSlug) {
    console.error("Error: SCHOOL_ID env var is required (e.g. SCHOOL_ID=kopess)");
    process.exit(1);
  }

  if (!password) {
    console.error("Error: ADMIN_PASSWORD env var is required");
    process.exit(1);
  }

  // Find or create the School record
  let school = await prisma.school.findUnique({ where: { slug: schoolSlug } });

  if (school) {
    console.log(`✓ School "${schoolSlug}" found (id: ${school.id})`);
  } else {
    school = await prisma.school.create({
      data: {
        slug: schoolSlug,
        name: schoolSlug.toUpperCase(),
        isActive: true,
      },
    });
    console.log(`✓ Created school "${schoolSlug}" (id: ${school.id})`);
  }

  // Check if admin already exists for this school + username
  const existing = await prisma.admin.findFirst({
    where: { schoolId: school.id, username },
  });

  if (existing) {
    console.log(`✓ Admin "${username}" already exists for school "${schoolSlug}" — skipping.`);
    return;
  }

  // Hash password and create admin
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      password: hashedPassword,
      schoolId: school.id,
    },
  });

  console.log(`✓ Created admin "${admin.username}" for school "${schoolSlug}" (id: ${admin.id})`);
  console.log("\nDone! You can now log in at /admin/login");
}

main()
  .catch((e) => {
    console.error("Script failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
