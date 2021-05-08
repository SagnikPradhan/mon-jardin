import { GetStaticProps } from "next";
import React from "react";
import { getList } from "./api/image/list";
import { Item } from "./api/image/upload";

export default function Home({ images }: { images: Item[] }) {
  return (
    <div
      className="
        flex flex-col
      "
    >
      {images.map(({ data: { filename, link } }) => (
        <div className="h-screen flex items-center justify-center ">
          <img key={filename} src={link} loading="lazy" className="h-3/4"></img>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { images: await getList() }, revalidate: 60 * 15 };
};
