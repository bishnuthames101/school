/**
 * Resets the admin password for a school to admin123 (or a custom password).
 *
 * Usage:
 *   npx tsx scripts/reset-admin-password.ts
 *   ADMIN_PASSWORD=newpassword npx tsx scripts/reset-admin-password.ts
 *
 * Requires SCHOOL_ID to be set in .env or environment.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const schoolSlug = process.env.SCHOOL_ID;
  const newPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (!schoolSlug) {
    console.error("Error: SCHOOL_ID env var is required");
    process.exit(1);
  }

  const school = await prisma.school.findUnique({ where: { slug: schoolSlug } });
  if (!school) {
    console.error(`Error: School "${schoolSlug}" not found in database. Run seed script first.`);
    process.exit(1);
  }

  const admin = await prisma.admin.findFirst({ where: { schoolId: school.id } });
  if (!admin) {
    console.error(`Error: No admin found for school "${schoolSlug}". Run create-admin script first.`);
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.admin.update({
    where: { id: admin.id },
    data: { password: hashedPassword },
  });

  console.log(`✓ Password reset for admin "${admin.username}" (school: ${schoolSlug})`);
  console.log(`✓ New password: ${newPassword}`);
  console.log("\nLog in at /admin/login and change the password from Settings.");
}

main()
  .catch((e) => {
    console.error("Script failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
