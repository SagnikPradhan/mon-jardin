import { S3 } from "@aws-sdk/client-s3";
import { PrismaClient } from "@mon-jardin/database";
import { useEffect, useState } from "react";

import { Options } from "../cli/options";
import { LocalImage } from "../img/local";
import { optimizeImage } from "../img/utils";

export function useCloud(options: Options) {
  const [connected, setConnected] = useState(false);

  const s3 = new S3({
    region: options.region,
    credentials: { accessKeyId: options.keyId, secretAccessKey: options.key },
  });

  const database = new PrismaClient();

  useEffect(() => {
    database
      .$connect()
      .then(() => setConnected(true))
      .catch(console.error);
  }, []);

  return {
    connected,

    disconnect: async function () {
      await database.$disconnect();
      s3.destroy();
    },

    getImages: function () {
      if (!connected) throw new Error("Not connected to database");

      return database.image.findMany();
    },

    getImageHashes: async function () {
      const images = await this.getImages();
      return images.map(({ hash }) => hash);
    },

    upload: async function ({
      image: originalImageSharpInstance,
      hash,
      path,
    }: LocalImage) {
      if (!connected) throw new Error("Not connected to database");

      const optimizedImageSharpInstance = optimizeImage(
        originalImageSharpInstance
      );

      const [optimizedImageBuffer, originalImageBuffer] = await Promise.all([
        optimizedImageSharpInstance.toBuffer(),
        originalImageSharpInstance.toBuffer(),
      ]);

      await s3.putObject({
        Key: `${hash}.original${path.ext}`,
        Bucket: options.bucket,
        Body: originalImageBuffer,
      });

      await s3.putObject({
        Key: `${hash}.optimized.webp`,
        Bucket: options.bucket,
        Body: optimizedImageBuffer,
      });

      await database.image.create({
        data: {
          hash,

          originalKey: `${hash}.original${path.ext}`,
          originalSize: originalImageBuffer.toString().length,

          optimizedKey: `${hash}.optimized.webp`,
          optimizedSize: optimizedImageBuffer.toString().length,

          bucket: options.bucket,
          region: options.region,
        },
      });
    },

    delete: async function (hash: string) {
      if (!connected) throw new Error("Not connected to database");

      const { optimizedKey, originalKey } = await database.image.delete({
        where: { hash },
      });

      await s3.deleteObject({ Bucket: options.bucket, Key: optimizedKey });
      await s3.deleteObject({ Bucket: options.bucket, Key: originalKey });
    },
  };
}
