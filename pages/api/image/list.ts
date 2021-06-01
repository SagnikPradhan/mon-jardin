import { NextApiRequest, NextApiResponse } from "next";
import { getAllImageDataDocuments } from "utils/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") response.status(405);
  else response.json(await getAllImageDataDocuments());
};
