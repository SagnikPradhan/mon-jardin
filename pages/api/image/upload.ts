import { NextApiRequest, NextApiResponse } from "next";
import { Form, File } from "multiparty";
import { nanoid } from "nanoid";

import * as image from "utils/image";
// import * as database from "utils/database";
// import * as datastore from "utils/datastore";

import { parse } from "path";

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
async function handleFile({ path }: File) {
  const images = await image.processImage(path);
  const id = nanoid();
  const originalExtenstion = parse(path).ext;

  console.log({
    name: `${id}.original${originalExtenstion}`,
    file: images.original,
    type: `image/${originalExtenstion.slice(1)}`,
  });
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const files = await getFiles(request);
  await Promise.all(files.map(handleFile));
  response.send("Worked");
};

export const config = { api: { bodyParser: false } };
