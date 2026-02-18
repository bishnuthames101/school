/**
 * Seed script: Creates the first School record ("kopess") and links
 * all existing rows in the database to it.
 *
 * Run ONCE after the multi-tenancy migration:
 *   npx tsx scripts/seed-first-school.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting first-school seed...\n");

  // 1. Create or find the School record
  let school = await prisma.school.findUnique({ where: { slug: "kopess" } });

  if (school) {
    console.log(`✓ School "kopess" already exists (id: ${school.id})`);
  } else {
    school = await prisma.school.create({
      data: {
        slug: "kopess",
        name: "KOPESS",
        isActive: true,
      },
    });
    console.log(`✓ Created school "kopess" (id: ${school.id})`);
  }

  const schoolId = school.id;

  // 2. Update all existing rows to set schoolId
  const tables = [
    "admins",
    "application_forms",
    "contact_forms",
    "events",
    "gallery_images",
    "notices",
    "popups",
  ] as const;

  for (const table of tables) {
    const result = await prisma.$executeRawUnsafe(
      `UPDATE "${table}" SET "schoolId" = $1 WHERE "schoolId" IS NULL`,
      schoolId
    );
    console.log(`✓ Updated ${result} rows in ${table}`);
  }

  console.log("\nSeed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
