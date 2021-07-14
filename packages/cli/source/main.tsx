import "dotenv/config";

import { Command } from "commander";
import React, { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { render, Box, Text } from "ink";

import { addOptions, Options } from "./helpers/cli/options";
import { getLocalImages, LocalImage } from "./helpers/img/local";
import {
  getHashOfCloudImages,
  intialiseS3,
  uploadImage,
} from "./helpers/img/s3";
import { S3 } from "@aws-sdk/client-s3";

const program = new Command();

program.version("1.0.0");
const options = addOptions(program);

program
  .command("push")
  .description("Sync contents of folder with cloud")
  .action(() => {
    render(<PushComponent options={options}></PushComponent>);
  });

type Nullable<T> = T | null;

const PushComponent = ({ options }: { options: Options }) => {
  const s3Ref = useRef<Nullable<S3>>(null);

  const [localImages, setLocalImages] = useState<Nullable<LocalImage[]>>(null);
  const [cloudImageHashes, setCloudImageHashes] =
    useState<Nullable<string[]>>(null);

  const [tasks, setTasks] = useImmer<
    { hash: string; status: "skipped" | "uploaded" | "uploading" | "errored" }[]
  >([]);

  useEffect(() => {
    s3Ref.current = intialiseS3(options);

    return () => {
      if (s3Ref.current) s3Ref.current.destroy();
    };
  }, []);

  useEffect(() => {
    const s3 = s3Ref.current;

    if (!s3) return;

    getHashOfCloudImages(s3, options.bucket)
      .then((hashes) => setCloudImageHashes(hashes))
      .catch();

    getLocalImages()
      .then((images) => setLocalImages(images))
      .catch();
  }, [s3Ref, options]);

  useEffect(() => {
    if (!localImages) return;
    if (!cloudImageHashes) return;
    if (!s3Ref.current) return;
    if (tasks.length > 0) return;

    const s3 = s3Ref.current;

    localImages.forEach(({ hash, image, path }) => {
      if (cloudImageHashes.includes(hash))
        setTasks((tasks) => {
          tasks.push({ hash, status: "skipped" });
        });
      else {
        setTasks((tasks) => {
          tasks.push({ hash, status: "uploading" });
        });

        uploadImage({
          image,
          hash,
          s3,
          bucket: options.bucket,
          originalExtension: path.ext,
        })
          .then(() =>
            setTasks((tasks) => {
              tasks.find((t) => t.hash === hash)!.status = "uploaded";
            })
          )
          .catch();
      }
    });
  }, [localImages, cloudImageHashes, s3Ref]);

  return (
    <Box flexDirection="column">
      {tasks.map(({ hash, status }) => (
        <Box key={hash}>
          <Text>
            {hash} - {status}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

program.parse();
