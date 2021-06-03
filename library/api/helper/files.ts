import { File, Form } from "multiparty";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
  files: File[]
) => Promise<void> | void;

/** Gets files as a promise */
function getFiles(request: NextApiRequest) {
  return new Promise<File[]>((resolve, reject) => {
    const form = new Form();

    form.parse(request, (err, _, files) =>
      err ? reject(err) : resolve(files.image)
    );
  });
}

/**
 * Exposes files from the request
 *
 * @param handler - NEXT api request handler with extra file parameter
 * @returns - NEXT api request handler
 */
export function files(handler: Handler): NextApiHandler {
  return async (request, response) => {
    const files = await getFiles(request);
    return handler(request, response, files);
  };
}
