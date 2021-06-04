import * as API from "mon-jardin/library/api/helper";
import { getSession } from "next-auth/client";

export default API.methods({
  GET: async (request, response) => {
    const session = await getSession({ req: request });
    response.json({ user: session?.user });
  },
});
