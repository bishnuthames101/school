import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "school-uploads";

// Allowed MIME types
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  ...IMAGE_TYPES,
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

export type UploadFolder =
  | "events"
  | "gallery"
  | "notices"
  | "popups"
  | "applications";

/**
 * Upload an image to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadImage(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string
): Promise<string> {
  const mimeType = file instanceof File ? file.type : (file as any).type;
  if (!IMAGE_TYPES.includes(mimeType)) {
    throw new Error(
      `Invalid image type: ${mimeType}. Allowed: ${IMAGE_TYPES.join(", ")}`
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      `Image too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 5MB`
    );
  }

  return uploadToStorage(schoolSlug, folder, file, fileName, mimeType);
}

/**
 * Upload a document (PDF, Word, etc.) to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadDocument(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string
): Promise<string> {
  const mimeType = file instanceof File ? file.type : (file as any).type;
  if (!DOCUMENT_TYPES.includes(mimeType)) {
    throw new Error(`Invalid document type: ${mimeType}`);
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    throw new Error(
      `Document too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: 10MB`
    );
  }

  return uploadToStorage(schoolSlug, folder, file, fileName, mimeType);
}

/**
 * Core upload function.
 */
async function uploadToStorage(
  schoolSlug: string,
  folder: UploadFolder,
  file: File | Blob,
  fileName: string,
  contentType: string
): Promise<string> {
  // Sanitize filename and add timestamp to prevent collisions
  const sanitized = fileName.replace(/[^a-zA-Z0-9.-]/g, "-").toLowerCase();
  const path = `${schoolSlug}/${folder}/${Date.now()}-${sanitized}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const markerIndex = fileUrl.indexOf(marker);

  if (markerIndex === -1) {
    console.warn(`Not a Supabase Storage URL, skipping delete: ${fileUrl}`);
    return;
  }

  const path = fileUrl.substring(markerIndex + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Delete multiple files from Supabase Storage.
 */
export async function deleteFiles(fileUrls: string[]): Promise<void> {
  const paths: string[] = [];
  const marker = `/storage/v1/object/public/${BUCKET}/`;

  for (const url of fileUrls) {
    const markerIndex = url.indexOf(marker);
    if (markerIndex !== -1) {
      paths.push(url.substring(markerIndex + marker.length));
    }
  }

  if (paths.length > 0) {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      console.error(`Failed to delete files: ${error.message}`);
    }
  }
}
