import sharp from "sharp";
import crypto from "crypto";
/**
 * P - Potrait
 * S - Small
 * L - Large
 */
const sizes = {
  P: { w: 340, h: 640 },
  S: { w: 1366, h: 768 },
  L: { w: 1920, h: 1080 },
} as const;

export type ImageSizes = typeof sizes;

export async function processImage(path: string) {
  const input = sharp(path);
  const stats = await input.stats();

  const hash = hashFn(path);

  const images = {
    P: {
      fileName: `${hash}-${sizes.P.w}-${sizes.P.h}.webp`,
      stream: createImage({ input, w: sizes.P.w, h: sizes.P.h }),
      ...sizes.P,
    },

    S: {
      fileName: `${hash}-${sizes.S.w}-${sizes.S.h}.webp`,
      stream: createImage({ input, w: sizes.S.w, h: sizes.S.h }),
      ...sizes.S,
    },

    L: {
      fileName: `${hash}-${sizes.L.w}-${sizes.L.h}.webp`,
      stream: createImage({ input, w: sizes.L.w, h: sizes.L.h }),
      ...sizes.L,
    },
  } as const;

  return {
    images,
    colour: stats.dominant,
  };
}

const createImage = ({
  h,
  w,
  input,
}: {
  h: number;
  w: number;
  input: sharp.Sharp;
}) =>
  input
    .clone()
    .resize({
      height: h,
      width: w,
      position: sharp.strategy.entropy,
      withoutEnlargement: true,
    })
    .webp();

const hashFn = (string: string) =>
  crypto.createHash("md5").update(string).digest("hex");
