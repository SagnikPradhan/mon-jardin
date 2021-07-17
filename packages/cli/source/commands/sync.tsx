import React, { useEffect } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

import { Options } from "../helpers/cli/options";
import { useCloud } from "../helpers/hooks/cloud";
import { Tasks, useTasks } from "../components/task";
import { useLocal } from "../helpers/hooks/local";

export function SyncCommand({ options }: { options: Options }) {
  const cloud = useCloud(options);
  const local = useLocal();

  const { dispatchTask, tasks } = useTasks({
    errored: { priority: 6, symbol: "❌" },
    deleting: { priority: 5, symbol: "🔥" },
    uploading: { priority: 4, symbol: "📤" },
    deleted: { priority: 3, symbol: "🗑️" },
    uploaded: { priority: 2, symbol: "☁️" },
    skipped: { priority: 1, symbol: "✔️" },
  });

  useEffect(() => {
    if (!cloud.connected) return;

    const main = async () => {
      const localImages = await local.getFiles();
      const cloudImagesHashes = await cloud.getImageHashes();

      // Upload local images
      for (const { hash, image, path } of localImages) {
        if (cloudImagesHashes.includes(hash)) {
          dispatchTask([hash, "skipped"]);
          continue;
        }

        dispatchTask([hash, "uploading"]);

        cloud
          .upload({ hash, image, path })
          .then(() => dispatchTask([hash, "uploaded"]))
          .catch(() => dispatchTask([hash, "errored"]));
      }

      // Delete cloud only images
      for (const cloudImageHash of cloudImagesHashes) {
        const localCopyExists = localImages.some(
          ({ hash }) => hash === cloudImageHash
        );

        if (localCopyExists) continue;

        dispatchTask([cloudImageHash, "deleting"]);

        await cloud
          .delete(cloudImageHash)
          .then(() => dispatchTask([cloudImageHash, "deleted"]))
          .catch(() => dispatchTask([cloudImageHash, "errored"]));
      }

      await cloud.disconnect();
    };

    main().catch();
  }, [cloud.connected]);

  if (!cloud.connected)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text> Connecting to cloud</Text>
      </Box>
    );
  else if (tasks.length === 0)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text> Calculating tasks</Text>
      </Box>
    );
  else return <Tasks>{tasks}</Tasks>;
}
