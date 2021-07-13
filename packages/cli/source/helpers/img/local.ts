import sharp from "sharp";

import path from "path";
import { promises as fs } from "fs";
import { hashImage } from "./utils";

interface LocalImage {
  path: path.ParsedPath;
  image: sharp.Sharp;
  hash: string;
}

/**
 * reads the local directory and gets all the images.
 * calculates their hashes, parses their paths, and
 * generates their sharp instances.
 *
 * @returns local images
 */
export async function getLocalImages() {
  const root = path.join(process.cwd(), "images");

  const images = [] as LocalImage[];

  for (const imageName of await fs.readdir(root)) {
    const imagePath = path.join(root, imageName);
    const parsedImagePath = path.parse(imagePath);

    const image = sharp(imagePath);
    const hash = await hashImage(image.clone());

    images.push({
      image,
      hash,
      path: parsedImagePath,
    });
  }

  return images;
}
