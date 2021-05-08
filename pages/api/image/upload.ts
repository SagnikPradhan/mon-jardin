import { NextApiRequest, NextApiResponse } from "next";
import { Form, File } from "multiparty";

import sharp from "sharp";
import AWS from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import Faunadb from "faunadb";

export interface Item {
  data: {
    link: string;
    filename: string;
    height: number;
    width: number;
    colour: [number, number, number];
  };
}

/** Gets files as a promise */
function getFiles(request: NextApiRequest) {
  return new Promise<File[]>((resolve, reject) => {
    const form = new Form();

    form.parse(request, (err, _, files) =>
      err ? reject(err) : resolve(files.image)
    );
  });
}

/** Handles S3 Upload and Faunadb Upate */
async function handleFile({ path, originalFilename }: File) {
  const image = sharp(path);
  const filename = "image-" + hash(originalFilename) + ".webp";

  const metadata = await image.metadata();

  const inputHeight = metadata.height || 1;
  const inputWidth = metadata.width || 1;
  const ratio = inputWidth / inputHeight;

  const outputWidth = ratio > 1 ? 800 : 400;
  const outputHeight = ratio > 1 ? 400 : 800;

  const {
    dominant: { r, g, b },
  } = await image.stats();

  const stream = await image
    .resize({
      width: outputWidth,
      height: outputHeight,
      fit: sharp.fit.cover,
      position: sharp.strategy.entropy,
    })
    .webp();

  const link = await uploadS3(filename, stream);

  await updateDatabase({
    data: {
      filename,
      colour: [r, g, b],
      height: outputHeight,
      width: outputWidth,
      link,
    },
  });
}

/** Updates Faundb */
async function updateDatabase(item: Item) {
  const secret = process.env["FAUNADB_TOKEN"];
  if (!secret) throw new Error("No FAUNADB_TOKEN env set");

  const client = new Faunadb.Client({ secret });
  const q = Faunadb.query;

  await client.query(q.Create(q.Collection("photos"), item));
}

/** Hash function */
function hash(string: string) {
  const FNV_PRIME = 0x01000193;
  const FNV_OFFSET_BASIS = 0x811c9dc5;

  let hash = FNV_OFFSET_BASIS;

  for (const character of string) {
    hash ^= character.charCodeAt(0);
    hash *= FNV_PRIME;
  }

  return hash;
}

/** Upload to S3 */
async function uploadS3(name: string, file: NodeJS.ReadableStream) {
  const accessKeyId = process.env["AWS_ACCESS_KEY_ID_APP"];
  if (!accessKeyId) throw new Error("No AWS_ACCESS_KEY_ID_APP env set");

  const secretAccessKey = process.env["AWS_SECRET_ACCESS_KEY_APP"];
  if (!secretAccessKey) throw new Error("No AWS_SECRET_ACCESS_KEY_APP env set");

  const region = process.env["AWS_REGION_APP"];
  if (!region) throw new Error("No AWS_REGION_APP env set");

  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
  });

  const s3 = new S3();

  const bucket = process.env["AWS_BUCKET_APP"];
  if (!bucket) throw new Error("No AWS_BUCKET_APP env set");

  const { Location } = await s3
    .upload({
      Bucket: bucket,
      Key: name,
      Body: file,
      ContentType: "image/webp",
    })
    .promise();

  return Location;
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const files = await getFiles(request);
  await Promise.all(files.map((file) => handleFile(file)));
  response.send("Worked");
};

export const config = { api: { bodyParser: false } };
