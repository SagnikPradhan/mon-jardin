import path from "path";
import sharp from "sharp";
import { promises as fs } from "fs";

import { hashFile } from "../img/utils";

export interface LocalImage {
  path: path.ParsedPath;
  image: sharp.Sharp;
  hash: string;
}

export function useLocal() {
  const root = path.join(process.cwd(), "images");

  return {
    getFiles: function () {
      return fs.readdir(root).then((imageNames) =>
        Promise.all(
          imageNames.map(async (imageName) => {
            const imagePath = path.join(root, imageName);
            const parsedImagePath = path.parse(imagePath);

            const image = sharp(imagePath);
            const hash = await hashFile(imagePath);

            return {
              image,
              hash,
              path: parsedImagePath,
            };
          })
        )
      );
    },

    writeFile: function (name: string, buffer: Buffer) {
      return fs.writeFile(path.join(root, name), buffer);
    },
  };
}
