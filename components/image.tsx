import { ImageMetadataWithId } from "utils/database";

export const Image = ({
  image: {
    images: { P, S, L },
  },
}: {
  image: ImageMetadataWithId;
}) => (
  <picture>
    <source
      type="image/webp"
      srcSet={L.link}
      media="(min-width: 1000px)"
      className="h-screen w-screen object-cover"
    />

    <source
      type="image/webp"
      srcSet={S.link}
      media="(min-width: 700px)"
      className="h-screen w-screen object-cover"
    />

    <img src={P.link} className="h-screen w-screen object-cover" />
  </picture>
);
