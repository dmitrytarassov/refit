import { loadPhotoImage } from "./load-photo-image";

const HEIC_NAME = /\.hei[cf]$/i;

/**
 * Decodes a picked photo. HEIC/HEIF is tried natively first (Safari decodes it);
 * when that fails, `heic-to` (libheif wasm, lazy-loaded) converts it to JPEG.
 */
export async function decodeSharePhoto(file: File): Promise<HTMLImageElement> {
  try {
    return await loadPhotoImage(file);
  } catch (error) {
    if (!HEIC_NAME.test(file.name) && !file.type.includes("hei")) {
      throw error;
    }
  }
  const { heicTo } = await import("heic-to");
  const jpeg = await heicTo({ blob: file, type: "image/jpeg", quality: 0.92 });
  return loadPhotoImage(jpeg);
}
