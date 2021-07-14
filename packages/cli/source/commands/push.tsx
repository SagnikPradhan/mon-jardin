import React, { useEffect, useReducer } from "react";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";

import { Options } from "../helpers/cli/options";
import { useS3 } from "../helpers/hooks/s3";
import getLocalImages from "../helpers/img/local";

type TaskStatus = "skipped" | "uploaded" | "uploading" | "errored";

interface Task {
  hash: string;
  status: TaskStatus;
}

export function PushCommand({ options }: { options: Options }) {
  const s3 = useS3(options);

  const [tasks, dispatchTask] = useReducer(
    (tasks: Task[], updatedTask: Task) => {
      const priority: Record<TaskStatus, number> = {
        errored: 2,
        uploading: 1,
        uploaded: 0,
        skipped: -1,
      };

      const reducedTasks = [
        ...tasks.filter((currentTask) => currentTask.hash !== updatedTask.hash),
        updatedTask,
      ];

      reducedTasks.sort((taskA, taskB) => {
        const aPriority = priority[taskA.status];
        const bPriority = priority[taskB.status];
        return aPriority === bPriority ? 0 : aPriority > bPriority ? 1 : -1;
      });

      return reducedTasks;
    },
    []
  );

  useEffect(() => {
    const main = async () => {
      const localImages = await getLocalImages();
      const cloudImages = await s3.imagesHash();

      for (const { hash, image, path } of localImages) {
        if (cloudImages.includes(hash)) {
          dispatchTask({ hash, status: "skipped" });
          continue;
        }

        dispatchTask({ hash, status: "uploading" });

        s3.upload({ hash, image, path })
          .then(() => dispatchTask({ hash, status: "uploaded" }))
          .catch(() => dispatchTask({ hash, status: "errored" }));
      }
    };

    main().catch();
  }, []);

  return (
    <Box flexDirection="column">
      {tasks.map(({ hash, status }) => (
        <Box key={hash} flexDirection="row">
          {status === "errored" ? (
            <Text color="redBright">✖</Text>
          ) : status === "skipped" ? (
            <Text color="yellow">✔</Text>
          ) : status === "uploading" ? (
            <Spinner></Spinner>
          ) : (
            <Text color="greenBright">✔</Text>
          )}

          <Text bold> {status} </Text>

          <Text>{hash}</Text>
        </Box>
      ))}
    </Box>
  );
}
