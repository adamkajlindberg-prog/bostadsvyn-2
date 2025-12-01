import { ImageClient } from "@bostadsvyn/images/image-client";
import { env } from "./env";

let _client: ImageClient | undefined;

export function getImageClient(): ImageClient {
  if (!_client) {
    _client = new ImageClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      bucket: env.R2_BUCKET,
      endpoint: env.R2_ENDPOINT,
      region: env.R2_REGION || "auto",
      secretAccessKey: env.R2_ACCESS_SECRET,
    });
  }
  return _client;
}

export function getImageUrl(path: string): string {
  return `${env.NEXT_PUBLIC_BUCKET_URL}/${path}`;
}

export function getPropertyImageUrl(imageId: string): string {
  return getImageUrl(`properties/${imageId}`);
}
