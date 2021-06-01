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

const collection = config.get("fauna.collection");

/** Image data */
export interface ImageData {
  optimized: string;
  original: string;
}

export type ImageDataWithId = ImageData & { id: number };

const client = new Client({ secret: config.get("fauna.token") });

/**
 * Create new image data document
 *
 * @param data - Image metadata
 */
export async function createImageDataDocument(data: ImageData) {
  await client.query(Create(Collection(collection), { data }));
}

/**
 * Delete image data document
 *
 * @param id - Id of the image
 */
export async function deleteImageDataDocument(id: string) {
  await client.query(Delete(Ref(Collection(collection), id)));
}

/**
 * Get all the images data documents
 *
 * @returns Images data
 */
export async function getAllImageDataDocuments() {
  const { data } = await client.query<{
    data: ImageDataWithId[];
  }>(
    FMap(
      Paginate(Documents(Collection("photos"))),
      Lambda((x) => Merge(Select("data", Get(x)), { id: Select("id", x) }))
    )
  );

  return data;
}
