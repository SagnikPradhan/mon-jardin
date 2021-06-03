import { Db, MongoClient } from "mongodb";

import config from "mon-jardin/library/config";

let database = null as Db | null;

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
 * Get a collection. Internally calls getDatabase
 *
 * @param collection - Collection name
 * @returns Collection
 */
export async function getCollection<C>(collection: string) {
  const database = await getDatabase();
  return database.collection<C>(collection);
}
