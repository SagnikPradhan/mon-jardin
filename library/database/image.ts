import { getCollection } from "./internal";

/** Image data */
export interface ImageData {
  id: string;
  optimized: string;
  original: string;
}

const IMAGE_COLLECTION = "images";

/**
 * Create new image data document
 *
 * @param data - Image metadata
 */
export async function createImageDataDocument(data: ImageData) {
  const collection = await getCollection<ImageData>(IMAGE_COLLECTION);
  await collection.insertOne(data);
}

/**
 * Delete image data document
 *
 * @param id - Id of the image
 */
export async function deleteImageDataDocument(id: string) {
  const collection = await getCollection<ImageData>(IMAGE_COLLECTION);
  await collection.findOneAndDelete({ id });
}

/**
 * Get all the images data documents
 *
 * @returns Images metadata
 */
export async function getAllImageDataDocuments() {
  const collection = await getCollection<ImageData>(IMAGE_COLLECTION);
  return await collection.find({}).toArray();
}

/**
 * Get image data document
 *
 * @param id - Id of image
 * @returns Image metadata
 */
export async function getImageDataDocument(id: string) {
  const collection = await getCollection<ImageData>(IMAGE_COLLECTION);
  return await collection.findOne({ id });
}
