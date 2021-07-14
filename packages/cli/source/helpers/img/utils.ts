import sharp from "sharp";

import crypto from "crypto";
import { promises as fs } from "fs";

/**
 * creates a sha1 hash of image
 *
 * @param sharpInstance - sharp instance
 * @returns - hash of image
 */
export async function hashFile(path: string) {
  const hash = crypto.createHash("sha1");
  const imageData = await fs.readFile(path);

  hash.update(imageData);
  return hash.digest("hex");
}

/**
 * creates an optimized copy of the images
 *
 * @param image - original image
 * @returns optimized image
 */
export function optimizeImage(image: sharp.Sharp) {
  return image
    .clone()
    .resize(400, 600, {
      position: sharp.strategy.entropy,
      fit: "cover",
      withoutEnlargement: true,
    })
    .webp();
}
