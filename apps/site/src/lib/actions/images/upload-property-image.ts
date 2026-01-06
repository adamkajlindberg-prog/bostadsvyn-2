"use server";

import {
  type ImageMimeType,
  imageMimeTypeMap,
  imageMimeTypes,
} from "@bostadsvyn/images/mime-types";
import { getImageClient } from "@/image";

export async function uploadPropertyImage(
  imageId: string,
  propertyType: string,
): Promise<string | null> {
  try {
    const customerId = process.env.VITEC_DEMO_CUSTOMER_ID;
    const authToken = process.env.VITEC_DEMO_AUTH_TOKEN;

    const imageUrl = `https://connect-qa.maklare.vitec.net/PublicAdvertising/Image/${customerId}/${imageId}`;

    const imageRes = await fetch(imageUrl, {
      headers: {
        Authorization: `Basic ${authToken}`,
        Accept: "image/*",
      },
    });

    if (!imageRes.ok) {
      console.error(
        `Failed to fetch image: ${imageRes.status} ${imageRes.statusText}`,
      );
      return null;
    }

    // Get MIME type from Content-Type header
    const contentType = imageRes.headers.get("content-type");

    // Determine MIME type and extension
    let mimeType: ImageMimeType = "image/webp";
    let extension = "webp";

    if (contentType) {
      if (imageMimeTypes.includes(contentType as ImageMimeType)) {
        mimeType = contentType as ImageMimeType;
        const extensions = imageMimeTypeMap[mimeType];
        extension = extensions[0]?.replace(".", "") || "webp";
      } else if (!contentType.includes("image/")) {
        console.warn(`Image has unsupported content type: ${contentType}`);
        return null;
      }
    }

    // Convert response to ArrayBuffer and generate timestamp-based filename
    const arrayBuffer = await imageRes.arrayBuffer();
    const filePath = propertyType.toLowerCase();
    const fileName = `${imageId}.${extension}`;
    const file = `${filePath}/${fileName}`;

    // Upload to R2
    await getImageClient().upload({
      id: `properties/${file}`,
      body: arrayBuffer,
      mimeType,
    });

    return file;
  } catch (error) {
    console.error(`Error uploading image to R2:`, error);
    return null;
  }
}
