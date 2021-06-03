import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import config from "mon-jardin/library/config";
import * as database from "mon-jardin/library/database/users";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: config.get("discord.clientId"),
      clientSecret: config.get("discord.clientSecret"),
    }),

    Providers.Google({
      clientId: config.get("google.clientId"),
      clientSecret: config.get("google.clientSecret"),
    }),
  ],

  callbacks: {
    signIn: async ({ email }) => {
      if (!email) return false;
      const user = await database.getUser(email);
      return !!user;
    },
  },
});
