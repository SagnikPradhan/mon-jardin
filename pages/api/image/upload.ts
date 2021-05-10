import { NextApiRequest, NextApiResponse } from "next";
import { Form, File } from "multiparty";

import { processImage } from "utils/image";
import { createImageMetadata, ImageMetadata } from "utils/database";
import { uploadFile } from "utils/datastore";

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
async function handleFile(path: string) {
  const {
    images: { P, S, L },
    colour,
  } = await processImage(path);

  const metadata: ImageMetadata = {
    colour,

    images: {
      P: {
        h: P.h,
        w: P.w,
        link: await uploadFile({
          name: P.fileName,
          file: P.stream,
          type: "image/webp",
        }),
      },

      S: {
        h: S.h,
        w: S.w,
        link: await uploadFile({
          name: S.fileName,
          file: S.stream,
          type: "image/webp",
        }),
      },

      L: {
        h: L.h,
        w: L.w,
        link: await uploadFile({
          name: L.fileName,
          file: L.stream,
          type: "image/webp",
        }),
      },
    },
  };

  await createImageMetadata(metadata);
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const files = await getFiles(request);
  await Promise.all(files.map((file) => handleFile(file.path)));
  response.send("Worked");
};

export const config = { api: { bodyParser: false } };
