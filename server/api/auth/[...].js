// file: ~/server/api/auth/[...].ts
import GithubProvider from "next-auth/providers/github";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    GithubProvider.default({
      clientId: useRuntimeConfig().public.githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
      authorization: {
        params: {
          scope: "read:user repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.bio = token.bio;
      session.user.location = token.location;
      session.user.blog = token.blog;
      session.user.company = token.company;
      session.user.twitter = token.twitter;
      session.user.repos = token.repos;
      session.user.accessToken = token.accessToken;
      return session;
    },

    async jwt({ token, profile, account }) {
      if (account?.provider === "github") {
        token.id = profile.id;
        token.username = profile.login;
        token.bio = profile.bio;
        token.location = profile.location;
        token.blog = profile.blog;
        token.company = profile.company;
        token.twitter = profile.twitter_username;
        token.defaultBranch = profile.default_branch;
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
});
