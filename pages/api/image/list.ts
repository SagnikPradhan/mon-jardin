import { NextApiRequest, NextApiResponse } from "next";
import { getAllImageDataDocuments } from "mon-jardin/library/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") response.status(405);
  else response.json(await getAllImageDataDocuments());
};
