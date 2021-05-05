import { NextApiRequest, NextApiResponse } from "next";
import Faunadb from "faunadb";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method !== "GET") {
    response.status(405);
    return;
  }

  const secret = process.env["FAUNADB_TOKEN"];
  if (!secret) throw new Error("No FAUNADB_TOKEN env set");

  const client = new Faunadb.Client({ secret });
  const q = Faunadb.query;

  const { data } = (await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("photos"))),
      q.Lambda((x) => q.Get(x))
    )
  )) as { data: { data: { link: string } }[] };

  const body = data.map(({ data }) => data.link);
  response.json(body);
};
