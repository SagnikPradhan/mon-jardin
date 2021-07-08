import sharp from "sharp";

const SIZE = 12;

export async function hashImage(sharpInstance: sharp.Sharp) {
  const pixelArray = await getPixelArray(sharpInstance);
  const hashBits = [] as (0 | 1)[];

  for (const [index, pixel] of pixelArray.entries()) {
    const nextPixel = pixelArray[index + 1];
    if (nextPixel !== undefined) hashBits.push(nextPixel > pixel ? 1 : 0);
  }

  return hashBits.join("");
}

function getPixelArray(sharpInstance: sharp.Sharp) {
  return sharpInstance
    .clone()
    .greyscale()
    .resize(SIZE + 1, SIZE, { fit: "fill" })
    .raw()
    .toBuffer()
    .then((buffer) => new Uint8Array(buffer));
}
