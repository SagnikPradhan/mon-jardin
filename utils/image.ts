import sharp from "sharp";
import { createReadStream } from "fs";

export const OPTIMIZED_IMAGE_SIZE = [400, 600] as const;

export const processImage = async (path: string) => ({
  original: createReadStream(path),
  optimized: createOptimizedImage(path),
});

const createOptimizedImage = (path: string) =>
  sharp(path)
    .clone()
    .resize({
      width: OPTIMIZED_IMAGE_SIZE[0],
      height: OPTIMIZED_IMAGE_SIZE[1],
      position: sharp.strategy.entropy,
      withoutEnlargement: true,
    })
    .webp();
