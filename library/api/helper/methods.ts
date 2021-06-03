import { NextApiHandler } from "next";
import { Methods, Status } from "../constants";

/**
 * Compose several request handlers based on method
 *
 * @param map - Map of methods to request handler
 * @returns - NEXT api request handler
 */
export function methods(
  map: {
    [method in Methods]?: NextApiHandler;
  }
): NextApiHandler {
  return (request, response) => {
    const handler = request.method ? map[request.method as Methods] : null;
    if (handler) return handler(request, response);
    else response.status(Status.METHOD_NOT_ALLOWED);
  };
}
