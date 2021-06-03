import React from "react";
import { GetStaticProps } from "next";

import * as database from "mon-jardin/library/database";

export default function Home({ images }: { images: database.ImageData[] }) {
  return <h1>Hey there</h1>;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { images: await database.getAllImageDataDocuments() },
    revalidate: 60 * 15,
  };
};
