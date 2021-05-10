import { z } from "zod";
import { Configuration } from "kanaphig";

const configuration = new Configuration(
  z.object({
    discord: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
    }),

    emails: z.array(z.string()),

    aws: z.object({
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
      region: z.string(),
      bucket: z.string(),
    }),

    fauna: z.object({
      token: z.string(),
      collection: z.string(),
    }),
  })
).env({
  discord: {
    clientId: { $env: "DISCORD_CLIENT_ID" },
    clientSecret: { $env: "DISCORD_CLIENT_SECRET" },
  },

  emails: { $env: "EMAILS", $transformer: (env) => env.split(",") },

  aws: {
    accessKeyId: { $env: "AWS_ACCESS_KEY_ID_APP" },
    secretAccessKey: { $env: "AWS_SECRET_ACCESS_KEY_APP" },
    region: { $env: "AWS_REGION_APP" },
    bucket: { $env: "AWS_BUCKET_APP" },
  },

  fauna: {
    token: { $env: "FAUNADB_TOKEN" },
    collection: { $env: "FAUNADB_COLLECTION" },
  },
});

configuration.validate();

export default configuration;
