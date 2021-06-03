import { MongoClient, Db } from "mongodb";

import config from "mon-jardin/utils/config";

/** Image data */
export interface ImageData {
  id: string;
  optimized: string;
  original: string;
}

let database = null as Db | null;
const IMAGE_COLLECTION = "images";

/**
 * Conencts to mongodb and gets the database
 * if not already cached
 *
 * @returns Databas
 */
async function getDatabase() {
  if (database) return database;

  const client = new MongoClient(config.get("mongodb.url"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  return client.db();
}

/**
 * Create new image data document
 *
 * @param data - Image metadata
 */
export async function createImageDataDocument(data: ImageData) {
  const database = await getDatabase();
  await database.collection<ImageData>(IMAGE_COLLECTION).insertOne(data);
}

/**
 * Delete image data document
 *
 * @param id - Id of the image
 */
export async function deleteImageDataDocument(id: string) {
  const database = await getDatabase();
  await database
    .collection<ImageData>(IMAGE_COLLECTION)
    .findOneAndDelete({ id });
}

/**
 * Get all the images data documents
 *
 * @returns Images data
 */
export async function getAllImageDataDocuments(): Promise<ImageData[]> {
  const database = await getDatabase();
  return await database
    .collection<ImageData>(IMAGE_COLLECTION)
    .find({})
    .toArray();
}
