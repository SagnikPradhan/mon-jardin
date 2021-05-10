import { NextApiRequest, NextApiResponse } from "next";
import { getAllImagesMetadata } from "mon-jardin/utils/database";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") response.status(405);
  else response.json(await getAllImagesMetadata());
};
