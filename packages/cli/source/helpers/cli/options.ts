import { Command } from "commander";

export interface Options {
  key: string;
  keyId: string;
  bucket: string;
  region: string;
}

/**
 * adds cli options and returns them
 *
 * @param program - commander program
 * @returns options
 */
export function addOptions(program: Command) {
  program.requiredOption(
    "-k, --key [key]",
    "aws secret access key, or set env MON_JARDIN_AWS_SECRET_ACCESS_KEY",
    process.env["MON_JARDIN_AWS_SECRET_ACCESS_KEY"]
  );

  program.requiredOption(
    "-id, --key-id [id]",
    "aws secret access key id, or set env MON_JARDIN_AWS_SECRET_ACCESS_KEY_ID",
    process.env["MON_JARDIN_AWS_SECRET_ACCESS_KEY_ID"]
  );

  program.requiredOption(
    "-b, --bucket [bucket]",
    "aws bucket name, or set env MON_JARDIN_AWS_BUCKET",
    process.env["MON_JARDIN_AWS_BUCKET"]
  );

  program.requiredOption(
    "-r, --region [region]",
    "aws region name, or set env MON_JARDIN_AWS_REGION",
    process.env["MON_JARDIN_AWS_REGION"]
  );

  return program.opts<Options>();
}
