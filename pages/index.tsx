import React from "react";
import { GetStaticProps } from "next";

import { getAllImageDataDocuments, ImageDataWithId } from "utils/database";

export default function Home({ images }: { images: ImageDataWithId[] }) {
  return <h1>Hey there</h1>;
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { images: await getAllImageDataDocuments() },
    revalidate: 60 * 15,
  };
};
