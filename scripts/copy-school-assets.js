import { cpSync, existsSync, mkdirSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Load .env for local development (Vercel sets env vars directly)
dotenv.config({ path: join(rootDir, ".env") });

const schoolId = process.env.SCHOOL_ID;

if (!schoolId) {
  console.warn(
    "⚠ SCHOOL_ID not set — skipping asset copy. This is expected in development without SCHOOL_ID."
  );
  process.exit(0);
}

const assetsDir = join(rootDir, "schools", schoolId, "assets");
const targetDir = join(rootDir, "public", "school-assets");

if (!existsSync(assetsDir)) {
  console.error(
    `✗ School assets not found: schools/${schoolId}/assets/\n` +
      `  Make sure the school folder exists before building.`
  );
  process.exit(1);
}

// Clean target directory to avoid stale files from a previous school
if (existsSync(targetDir)) {
  rmSync(targetDir, { recursive: true, force: true });
}

mkdirSync(targetDir, { recursive: true });

// Copy all assets from the school folder to public/school-assets
cpSync(assetsDir, targetDir, { recursive: true });

console.log(`✓ Copied school assets: schools/${schoolId}/assets/ → public/school-assets/`);
