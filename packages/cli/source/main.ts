import "dotenv/config";

import { Command } from "commander";

import { addOptions } from "./helpers/cli/options";
import { getLocalImages } from "./helpers/images/local";
import {
  getHashOfCloudImages,
  intialiseS3,
  uploadImage,
} from "./helpers/images/s3";

const program = new Command();

program.version("1.0.0");
const options = addOptions(program);

program
  .command("push")
  .description("Sync contents of folder with cloud")
  .action(async () => {
    const s3 = intialiseS3(options);

    const cloudImagesHash = await getHashOfCloudImages(s3, options.bucket);
    const localImages = await getLocalImages();

    for (const { hash, image, path } of localImages)
      if (cloudImagesHash.includes(hash)) continue;
      else
        await uploadImage({
          image,
          hash,
          originalExtension: path.ext,
          bucket: options.bucket,
          s3,
        });
  });

program.parse();
