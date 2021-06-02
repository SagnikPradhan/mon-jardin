import React from "react";
import { GetStaticProps } from "next";

import * as database from "mon-jardin/utils/database";

export default function Home({
  images,
}: {
  images: database.ImageDataWithId[];
}) {
  return <h1>Hey there</h1>;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { images: await database.getAllImageDataDocuments() },
    revalidate: 60 * 15,
  };
};
