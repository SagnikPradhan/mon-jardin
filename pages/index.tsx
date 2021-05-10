import React from "react";
import { GetStaticProps } from "next";

import {
  getAllImagesMetadata,
  ImageMetadataWithId,
} from "mon-jardin/utils/database";

export default function Home({ images }: { images: ImageMetadataWithId[] }) {
  return (
    <div
      className="
        flex flex-col
      "
    >
      {images.map(({ id, images: { P, S, L } }) => (
        <div key={id} className="h-screen flex items-center justify-center ">
          <picture>
            <source
              type="image/webp"
              srcSet={L.link}
              media="(min-width: 1500px)"
            />

            <source
              type="image/webp"
              srcSet={S.link}
              media="(min-width: 1000px)"
            />

            <img src={P.link} />
          </picture>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { images: await getAllImagesMetadata() },
    revalidate: 60 * 15,
  };
};
