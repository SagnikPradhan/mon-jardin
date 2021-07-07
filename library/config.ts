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

    mongodb: z.object({
      url: z.string(),
    }),

    google: z.object({
      clientId: z.string(),
      clientSecret: z.string(),
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

  mongodb: {
    url: { $env: "DATABASE_URL" },
  },

  google: {
    clientId: { $env: "GOOGLE_CLIENT_ID" },
    clientSecret: { $env: "GOOGLE_CLIENT_SECRET" },
  },
});

configuration.validate();

export default configuration;
