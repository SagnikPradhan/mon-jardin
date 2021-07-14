import { _Object } from "@aws-sdk/client-s3";
import { Options } from "../helpers/cli/options";
import { useS3 } from "../helpers/hooks/s3";

import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import Spinner from "ink-spinner";
import Table from "ink-table";

import prettyBytes from "pretty-bytes";

export function StatusCommand({
  options,
  detail,
}: {
  options: Options;
  detail: boolean;
}) {
  const s3 = useS3(options);
  const [images, setImages] = useState<_Object[] | null>(null);

  useEffect(() => {
    s3.images()
      .then((images) => setImages(images))
      .catch();
  }, []);

  if (!images)
    return (
      <Box flexDirection="row">
        <Spinner></Spinner>
        <Text color="yellow"> Collecting data</Text>
      </Box>
    );
  else
    return (
      <Box flexDirection="column">
        {detail && <Table data={extractData(images)}></Table>}

        <Box flexDirection="row">
          <Text>Total Size </Text>
          <Text bold>
            {prettyBytes(
              images.reduce((acc, { Size }) => acc + (Size || 0), 0)
            )}
          </Text>
        </Box>
      </Box>
    );
}

function extractData(images: _Object[]) {
  const merged = {} as Record<string, { original: number; optimized: number }>;

  for (const image of images) {
    const [hash, type, _] = image.Key!.split(".") as [
      string,
      "optimized" | "original",
      string
    ];

    merged[hash] = {
      original: 0,
      optimized: 0,
      ...merged[hash],
      [type]: image.Size || 0,
    };
  }

  return Object.entries(merged).map(([hash, { optimized, original }]) => ({
    hash,
    original: prettyBytes(original),
    optimized: prettyBytes(optimized),
    decrease: Math.round(((original - optimized) / original) * 100) + "%",
  }));
}
