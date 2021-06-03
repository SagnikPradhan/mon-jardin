import * as database from "mon-jardin/library/database/image";
import * as API from "mon-jardin/library/api/helper";

import { Status } from "mon-jardin/library/api/constants";
import { Auth } from "mon-jardin/library/api/middleware/auth";

// API
export default API.methods({
  GET: async (request, response) => {
    const { id } = request.query as { id: string };
    response.json(await database.getImageDataDocument(id));
  },

  DELETE: API.pass(
    Auth,

    async (request, response) => {
      const { id } = request.query as { id: string };
      await database.deleteImageDataDocument(id);
      response.status(Status.OK);
    }
  ),
});
