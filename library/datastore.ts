import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";

import config from "mon-jardin/library/config";

const { accessKeyId, secretAccessKey, region, bucket } = config.get("aws");
AWS.config.update({ accessKeyId, secretAccessKey, region });

const s3 = new S3();

/**
 * Upload file to s3
 *
 * @param options - File details
 * @param options.name - Name of the file
 * @param options.file - File stream
 * @param options.type - Type of file
 * @returns URL of the uploaded file
 */
export async function uploadFile({
  name,
  file,
  type,
}: {
  name: string;
  file: NodeJS.ReadableStream;
  type: string;
}) {
  const { Location } = await s3
    .upload({
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: type,
      CacheControl: "public, max-age=604800, immutable",
    })
    .promise();

  return Location;
}

/**
 * Delete a file in s3
 *
 * @param name - Name of the file
 */
export async function deleteFile(name: string) {
  await s3.deleteObject({ Bucket: bucket, Key: name }).promise();
}
