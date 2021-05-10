import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import config from "mon-jardin/utils/config";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env["DISCORD_CLIENT_ID"],
      clientSecret: process.env["DISCORD_CLIENT_SECRET"],
    }),
  ],

  callbacks: {
    signIn: (user) => {
      const emails = config.get("emails");
      return emails.includes(user.email || "");
    },
  },
});
