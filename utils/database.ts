import {
  Client,
  Collection,
  Create,
  Ref,
  Delete,
  Map as FMap,
  Paginate,
  Documents,
  Lambda,
  Get,
  Select,
  Merge,
} from "faunadb";

import config from "utils/config";
import { ImageSizes } from "utils/image";

const collection = config.get("fauna.collection");

/** Image metadata */
export interface ImageMetadata {
  images: { [K in keyof ImageSizes]: ImageSizes[K] & { link: string } };
  colour: { r: number; g: number; b: number };
}

export type ImageMetadataWithId = ImageMetadata & { id: number };

const client = new Client({ secret: config.get("fauna.token") });

/**
 * Create new image metadata document
 *
 * @param data - Image metadata
 */
export async function createImageMetadata(data: ImageMetadata) {
  await client.query(Create(Collection(collection), { data }));
}

/**
 * Delete image metadata document
 *
 * @param id - Id of the image
 */
export async function deleteImageMetadata(id: string) {
  await client.query(Delete(Ref(Collection(collection), id)));
}

/**
 * Get all the images metadata documents
 *
 * @returns Images metadata
 */
export async function getAllImagesMetadata() {
  const { data } = await client.query<{
    data: ImageMetadataWithId[];
  }>(
    FMap(
      Paginate(Documents(Collection("photos"))),
      Lambda((x) => Merge(Select("data", Get(x)), { id: Select("id", x) }))
    )
  );

  return data;
}
