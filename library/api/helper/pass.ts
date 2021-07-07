import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Handler = (
  request: NextApiRequest,
  response: NextApiResponse
) => Promise<{ pass: boolean } | void> | { pass: boolean } | void;

/**
 * Passes request and response through the array of handlers.
 * Passes only if the previous implicitly or explicitly allows to pass.
 *
 * @param handlers - NEXT api request handlers
 * @returns Next api request handler
 */
export function pass(...handlers: Handler[]): NextApiHandler {
  return async (request, response) => {
    for (const handler of handlers) {
      const result = await handler(request, response);
      if (result === undefined || result.pass) continue;
      else break;
    }
  };
}
