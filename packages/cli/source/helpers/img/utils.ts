import sharp from "sharp";

const IMAGE_HASH_GRID_SIZE = 12;

/**
 * creates a hash of image
 *
 * @param sharpInstance - sharp instance
 * @returns - perceptual hash of image
 */
export async function hashImage(sharpInstance: sharp.Sharp) {
  const pixelArray = await getPixelArray(sharpInstance);
  const hashBits = [] as (0 | 1)[];

  for (const [index, pixel] of pixelArray.entries()) {
    const nextPixel = pixelArray[index + 1];
    if (nextPixel !== undefined) hashBits.push(nextPixel > pixel ? 1 : 0);
  }

  return parseInt(hashBits.join(""), 2).toString(16);
}

function getPixelArray(sharpInstance: sharp.Sharp) {
  return sharpInstance
    .greyscale()
    .resize(IMAGE_HASH_GRID_SIZE + 1, IMAGE_HASH_GRID_SIZE, { fit: "fill" })
    .raw()
    .toBuffer()
    .then((buffer) => new Uint8Array(buffer));
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
