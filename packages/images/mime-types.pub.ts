import { keys } from "remeda";
import { z } from "zod";

export const imageMimeTypeMap = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export type ImageMimeType = keyof typeof imageMimeTypeMap;

export const imageMimeTypes = keys(imageMimeTypeMap);

export const getImageMimeTypeFromExtension = (
  ext: string,
): ImageMimeType | null => {
  for (const [mimeType, extensions] of Object.entries(imageMimeTypeMap)) {
    if (extensions.includes(ext)) {
      return mimeType as ImageMimeType;
    }
  }
  return null;
};

export const zImageMimeType = z.enum(imageMimeTypes);

/**
 * Get the content type from a file path
 */
export function getMimeTypeFromFilePath(path: string): ImageMimeType {
  const extension = path.split(".").pop()?.toLowerCase();

  if (!extension) {
    throw new Error(`File ${path} has no extension`);
  }

  const mimeType = getImageMimeTypeFromExtension(extension);

  if (!mimeType) {
    throw new Error(`Unsupported file type ${extension} for file ${path}`);
  }

  return mimeType;
}

/**
 * Get the content type from a data URL
 */
export function getImageMimeTypeFromDataUrl(dataUrl: string): string {
  const parts = dataUrl.split(";");

  if (parts.length < 2) {
    throw new Error(`Malformed data URL ${dataUrl.slice(0, 100)}`);
  }

  const mimeType = parts[0]?.split(":")[1] as ImageMimeType;

  if (!mimeType) {
    throw new Error(`Malformed data URL ${dataUrl.slice(0, 100)}`);
  }

  if (!imageMimeTypes.includes(mimeType)) {
    throw new Error(`Unsupported MIME type ${mimeType}`);
  }

  return mimeType;
}
