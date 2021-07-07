import React from "react";
import { GetStaticProps } from "next";

import * as database from "mon-jardin/library/database/image";

export default function Home({ images }: { images: database.ImageData[] }) {
  return <h1>Hey there</h1>;
}

export const getStaticProps: GetStaticProps<{ images: database.ImageData[] }> =
  async () => {
    const databaseQuery = await database.getAllImageDataDocuments();

    return {
      props: {
        images: databaseQuery.map(({ id, optimized, original }) => ({
          id,
          optimized,
          original,
        })),
      },

      revalidate: 60 * 15,
    };
  };
