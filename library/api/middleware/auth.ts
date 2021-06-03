import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Status } from "mon-jardin/library/api/constants";

export function Auth(request: NextApiRequest, response: NextApiResponse) {
  const session = getSession({ req: request });
  if (session) return { pass: true };
  else return response.status(Status.UNAUTHORIZED), { pass: false };
}
