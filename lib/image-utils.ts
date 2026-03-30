/**
 * Pure image URL utilities — safe to import in client components.
 * No Supabase client here; use lib/storage.ts for upload/delete (server-only).
 */

export interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number; // 1–100
  format?: "webp" | "avif" | "origin";
  resize?: "cover" | "contain" | "fill";
}

export const IMAGE_PRESETS = {
  thumbnail: { width: 400, quality: 70, format: "webp" as const },
  card:      { width: 800, quality: 75, format: "webp" as const },
  full:      { width: 1200, quality: 80, format: "webp" as const },
  avatar:    { width: 200, height: 200, quality: 80, format: "webp" as const, resize: "cover" as const },
} satisfies Record<string, ImageTransformOptions>;

/**
 * Returns an optimized image URL using Supabase Pro image transformations.
 * Non-Supabase URLs (pexels, placeholders, etc.) are returned unchanged.
 */
export function getImageUrl(
  url: string,
  options: ImageTransformOptions = IMAGE_PRESETS.card
): string {
  if (!url || !url.includes("supabase.co/storage")) return url;

  // /storage/v1/object/public/ → /storage/v1/render/image/public/
  const renderUrl = url.replace(
    "/storage/v1/object/public/",
    "/storage/v1/render/image/public/"
  );

  const params = new URLSearchParams();
  if (options.width)   params.set("width",   String(options.width));
  if (options.height)  params.set("height",  String(options.height));
  if (options.quality) params.set("quality", String(options.quality));
  if (options.format)  params.set("format",  options.format);
  if (options.resize)  params.set("resize",  options.resize);

  return `${renderUrl}?${params.toString()}`;
}
