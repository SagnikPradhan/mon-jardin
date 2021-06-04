import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { Status } from "mon-jardin/library/api/constants";

export async function Auth(request: NextApiRequest, response: NextApiResponse) {
  const session = await getSession({ req: request });
  if (session?.user) return { pass: true };
  else {
    response.status(Status.UNAUTHORIZED).send("UNAUTHORIZED");
    return { pass: false };
  }
}
