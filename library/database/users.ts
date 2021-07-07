import { getCollection } from "./internal";

interface User {
  email: string;
}

const USER_COLLECTION = "users";

/**
 * Get an user
 *
 * @param email - Email of user
 * @returns User or null
 */
export async function getUser(email: string) {
  const collection = await getCollection<User>(USER_COLLECTION);
  return collection.findOne({ email });
}

/**
 * Get all users
 *
 * @returns Users array
 */
export async function getUsers() {
  const collection = await getCollection<User>(USER_COLLECTION);
  return collection.find({}).toArray();
}

/**
 * Create a new user
 *
 * @param email - User email
 */
export async function createUser(email: string) {
  const collection = await getCollection<User>(USER_COLLECTION);
  await collection.insertOne({ email });
}

/**
 * Delete an user
 *
 * @param email - User email
 */
export async function deleteUser(email: string) {
  const collection = await getCollection<User>(USER_COLLECTION);
  await collection.findOneAndDelete({ email });
}
