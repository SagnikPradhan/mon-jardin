import { _Object } from "@aws-sdk/client-s3";
import { Options } from "../helpers/cli/options";
import { useCloud } from "../helpers/hooks/cloud";

import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import Spinner from "ink-spinner";

import prettyBytes from "pretty-bytes";
import { Image } from "@mon-jardin/database";

interface Information {
  total: string;
  decrease: string;
}

export function StatusCommand({ options }: { options: Options }) {
  const cloud = useCloud(options);
  const [info, setInfo] = useState<Information | null>(null);

  useEffect(() => {
    if (cloud.connected)
      cloud
        .getImages()
        .then((images) => extractInfo(images))
        .then((info) => setInfo(info))
        .then(() => cloud.disconnect())
        .catch();
  }, [cloud.connected]);

  if (!cloud.connected)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text> Connecting to cloud</Text>
      </Box>
    );
  else if (!info)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text> Collecting data</Text>
      </Box>
    );
  else
    return (
      <Box flexDirection="column">
        <Box flexDirection="row">
          <Text>Total Size </Text>
          <Text bold>{info.total}</Text>
        </Box>

        <Box flexDirection="row">
          <Text>Total Decrease </Text>
          <Text bold>{info.decrease}</Text>
        </Box>
      </Box>
    );
}

function extractInfo(images: Image[]) {
  const [originalSize, optimizedSize] = images.reduce(
    ([og, op], { originalSize, optimizedSize }) => [
      og + originalSize,
      op + optimizedSize,
    ],
    [0, 0]
  );

  return {
    total: prettyBytes(originalSize + optimizedSize),
    decrease:
      Math.floor(((originalSize - optimizedSize) / (originalSize || 1)) * 100) +
      "%",
  };
}
