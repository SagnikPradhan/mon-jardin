import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Discord({
      clientId: process.env["DISCORD_CLIENT_ID"],
      clientSecret: process.env["DISCORD_CLIENT_SECRET"],
    }),
  ],

  callbacks: {
    signIn: (user) => {
      const emailStr = process.env["EMAILS"] || "";
      const emails = emailStr.split(",");
      return emails.includes(user.email || "");
    },
  },
});
