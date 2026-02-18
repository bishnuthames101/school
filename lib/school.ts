/**
 * School ID resolver — resolves the current school from the SCHOOL_ID env var.
 * Every deployment has SCHOOL_ID set.
 */

import prisma from "./db";

let cachedSchoolId: string | null = null;

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
  return school.id;
}

export function getSchoolSlug(): string {
  const slug = process.env.SCHOOL_ID;
  if (!slug) throw new Error("SCHOOL_ID env var not set");
  return slug;
}
