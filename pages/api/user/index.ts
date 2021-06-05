import * as API from "mon-jardin/library/api/helper";
import { getSession } from "next-auth/client";
import * as database from "mon-jardin/library/database/users";
import { Status } from "mon-jardin/library/api/constants";
import { Auth } from "mon-jardin/library/api/middleware/auth";

export default API.methods({
  GET: async (request, response) => {
    const session = await getSession({ req: request });

    if (session?.user?.email)
      response.json({ user: await database.getUser(session.user.email) });
    else response.json({ user: null });
  },

  POST: API.pass(
    Auth,

    async (request, response) => {
      if (typeof request.body.email !== "string")
        return response.status(Status.BAD_REQUEST).send("BAD_REQUEST");
      else {
        await database.createUser(request.body.email);
        return response.status(Status.CREATED).send("CREATED");
      }
    }
  ),
});
