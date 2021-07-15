import { _Object } from "@aws-sdk/client-s3";
import { Options } from "../helpers/cli/options";
import { useS3 } from "../helpers/hooks/s3";

import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import Spinner from "ink-spinner";

import prettyBytes from "pretty-bytes";

interface Information {
  total: string;
  decrease: string;
}

export function StatusCommand({ options }: { options: Options }) {
  const s3 = useS3(options);
  const [info, setInfo] = useState<Information | null>(null);

  useEffect(() => {
    s3.images()
      .then((images) => extractInfo(images))
      .then((info) => setInfo(info))
      .catch();
  }, []);

  if (!info)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text color="yellow"> Collecting data</Text>
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

function extractInfo(images: _Object[]) {
  const originalSizes = [] as number[];
  const optimizedSizes = [] as number[];

  for (const { Key, Size } of images) {
    if (!Key || !Size) continue;
    const type = Key.split(".")[1] as "optimized" | "original";
    (type === "original" ? originalSizes : optimizedSizes).push(Size);
  }

  const originalSize = add(originalSizes);
  const optimizedSize = add(optimizedSizes);

  return {
    total: prettyBytes(originalSize + optimizedSize),
    decrease:
      Math.floor(((originalSize - optimizedSize) / originalSize) * 100) + "%",
  };
}

function add(values: number[]) {
  return values.reduce((acc, value) => acc + value, 0);
}
