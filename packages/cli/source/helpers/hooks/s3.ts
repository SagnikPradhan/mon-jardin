import { S3 } from "@aws-sdk/client-s3";

import { Options } from "../cli/options";
import { LocalImage } from "../img/local";
import { optimizeImage } from "../img/utils";

export function useS3(options: Options) {
  const s3 = new S3({
    region: options.region,
    credentials: { accessKeyId: options.keyId, secretAccessKey: options.key },
  });

  return {
    imagesHash: async function () {
      const objects = await s3.listObjects({ Bucket: options.bucket });

      return objects.Contents
        ? objects.Contents.map(({ Key }) => Key?.split(".")[0]).filter(
            (value): value is string => typeof value === "string"
          )
        : [];
    },

    upload: async function ({ image, hash, path }: LocalImage) {
      const optimizedImage = optimizeImage(image);

      await s3.putObject({
        Key: `${hash}.original${path.ext}`,
        Bucket: options.bucket,
        Body: await image.toBuffer(),
      });

      await s3.putObject({
        Key: `${hash}.optimized.webp`,
        Bucket: options.bucket,
        Body: await optimizedImage.toBuffer(),
      });
    },
  };
}
