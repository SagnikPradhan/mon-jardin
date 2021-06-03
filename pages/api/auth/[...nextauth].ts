import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import config from "mon-jardin/library/config";

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
    signIn: (user) => {
      const emails = config.get("emails");
      return emails.includes(user.email || "");
    },
  },
});
