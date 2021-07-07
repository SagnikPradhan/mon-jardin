import * as API from "mon-jardin/library/api/helper";
import * as database from "mon-jardin/library/database/users";
import { Status } from "mon-jardin/library/api/constants";
import { Auth } from "mon-jardin/library/api/middleware/auth";

export default API.methods({
  DELETE: API.pass(
    Auth,

    async (request, response) => {
      const { id } = request.query as { id: string };
      await database.deleteUser(id);
      response.status(Status.OK).send("OK");
    }
  ),
});
