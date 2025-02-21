import GithubProvider from "next-auth/providers/github";
import { NuxtAuthHandler } from "#auth";
import {
  createOrUpdateFromGithub,
  getById,
  createOrGetFromGithub,
} from "~/server/db/user";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  debug: true,
  providers: [
    GithubProvider.default({
      clientId: useRuntimeConfig().public.githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
      authorization: {
        params: {
          scope: "read:user user:email public_repo admin:repo_hook",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        await createOrUpdateFromGithub(profile);
        return true;
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (account) {
        if (account.provider === "github") {
          const dbUser = await createOrGetFromGithub(profile);
          token.userId = dbUser.id;
          token.github = {
            username: profile?.login,
            accessToken: account.access_token,
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.github = token.github || null;
      session.user.id = token.userId;
      return session;
    },
  },
});
