import { nanoid } from "nanoid";
import { File } from "multiparty";

import * as path from "path";

import * as image from "mon-jardin/library/image";
import * as database from "mon-jardin/library/database/image";
import * as datastore from "mon-jardin/library/datastore";
import * as API from "mon-jardin/library/api/helper";

import { Status } from "mon-jardin/library/api/constants";
import { Auth } from "mon-jardin/library/api/middleware/auth";

export default API.methods({
  GET: async (_, response) => {
    response.json(await database.getAllImageDataDocuments());
  },

  POST: API.pass(
    Auth,

    API.files(async (_, response, files) => {
      await Promise.all(files.map(handleFileUpload));
      response.status(Status.CREATED);
    })
  ),
});

// Because we are handling multipart uploads
export const config = { api: { bodyParser: false } };

/**
 * Handle image upload.
 * Uploads image metadata to database
 * and the file to cloud storage.
 *
 * @param file - File
 */
async function handleFileUpload(file: File) {
  const images = await image.processImage(file.path);
  const id = nanoid();
  const originalExtenstion = path.parse(file.path).ext;

  const originalImageLink = await datastore.uploadFile({
    name: `${id}.original${originalExtenstion}`,
    file: images.original,
    type: `image/${originalExtenstion.slice(1)}`,
  });

  const optimizedImageLink = await datastore.uploadFile({
    name: `${id}.webp`,
    file: images.optimized,
    type: "image/webp",
  });

  await database.createImageDataDocument({
    id,
    original: originalImageLink,
    optimized: optimizedImageLink,
  });
}
