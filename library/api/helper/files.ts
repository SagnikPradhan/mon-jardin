import { File, Form } from "multiparty";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

type FilesMap = Record<string, File[]>;

type Handler = (
  request: NextApiRequest,
  response: NextApiResponse,
  filesMap: FilesMap
) => Promise<void> | void;

/** Gets files as a promise */
function getFiles(request: NextApiRequest) {
  return new Promise<FilesMap>((resolve, reject) => {
    const form = new Form();

    form.parse(request, (err, _, filesMap) =>
      err ? reject(err) : resolve(filesMap)
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
    const filesMap = await getFiles(request);
    return handler(request, response, filesMap);
  };
}
