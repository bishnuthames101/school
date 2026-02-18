import type { SchoolConfig } from "@/types/school";

let cachedConfig: SchoolConfig | null = null;

/**
 * Returns the school config for the current deployment.
 * Reads from schools/{SCHOOL_ID}/config.ts at build time.
 * The config is cached after first access.
 *
 * This is a synchronous function — safe to call from both
 * server and client components since the config is a static
 * TypeScript file bundled at build time.
 */
export function getSchoolConfig(): SchoolConfig {
  if (cachedConfig) return cachedConfig;

  const schoolId = process.env.SCHOOL_ID || process.env.NEXT_PUBLIC_SCHOOL_ID;
  if (!schoolId) {
    throw new Error(
      "SCHOOL_ID environment variable is not set. " +
        "Each Vercel deployment must have SCHOOL_ID set to the school's slug (e.g., 'kopess')."
    );
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const config = require(`@/schools/${schoolId}/config`).default as SchoolConfig;

    if (config.id !== schoolId) {
      throw new Error(
        `Config mismatch: SCHOOL_ID is "${schoolId}" but config.id is "${config.id}". These must match.`
      );
    }

    cachedConfig = config;
    return config;
  } catch (err) {
    if (err instanceof Error && err.message.includes("Config mismatch")) {
      throw err;
    }
    throw new Error(
      `School config not found for SCHOOL_ID="${schoolId}". ` +
        `Make sure schools/${schoolId}/config.ts exists.`
    );
  }
}
