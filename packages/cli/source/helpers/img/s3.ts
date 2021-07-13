import { S3 } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { Options } from "../cli/options";
import { optimizeImage } from "./utils";

/**
 * intialises the s3 instance with credentials and region
 *
 * @param options - options
 * @returns s3 instance
 */
export function intialiseS3(options: Options) {
  return new S3({
    region: options.region,
    credentials: { accessKeyId: options.keyId, secretAccessKey: options.key },
  });
}

/**
 * gets hash of all the images on cloud
 *
 * @param s3 - s3 instance
 * @param bucket - bucket name
 * @returns array of hashes
 */
export async function getHashOfCloudImages(s3: S3, bucket: string) {
  const objects = (await s3.listObjects({ Bucket: bucket })).Contents;

  return objects
    ? objects
        .map(({ Key }) => Key?.split(".")[0])
        .filter((value): value is string => typeof value === "string")
    : [];
}

/**
 * uploads the original and also the optimized version of the image to cloud.
 *
 * @param options - options
 * @param options.image - image sharp instance
 * @param options.hash - image hash
 * @param options.bucket - aws s3 bucket name
 * @param options.originalExtension - original image's extension
 * @param options.s3 - s3 instance
 */
export async function uploadImage({
  image,
  hash,
  bucket,
  originalExtension,
  s3,
}: {
  image: sharp.Sharp;
  hash: string;
  bucket: string;
  originalExtension: string;
  s3: S3;
}) {
  const optimizedImage = optimizeImage(image);

  await s3.putObject({
    Key: `${hash}.original${originalExtension}`,
    Bucket: bucket,
    Body: await image.toBuffer(),
  });

  await s3.putObject({
    Key: `${hash}.optimized.webp`,
    Bucket: bucket,
    Body: await optimizedImage.toBuffer(),
  });
}
