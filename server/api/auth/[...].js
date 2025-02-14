import GithubProvider from "next-auth/providers/github";
import { NuxtAuthHandler } from "#auth";
import { getOrCreateUser } from "../../utils/auth";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  debug: true,
  providers: [
    GithubProvider.default({
      clientId: useRuntimeConfig().public.githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        await getOrCreateUser(profile);
        return true;
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (account) {
        if (account.provider === "github") {
          token.github = {
            id: profile?.id,
            username: profile?.login,
            bio: profile?.bio,
            location: profile?.location,
            blog: profile?.blog,
            company: profile?.company,
            twitter: profile?.twitter_username,
            defaultBranch: profile?.default_branch,
            accessToken: account.access_token,
          };
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.github = token.github || null;
      session.user.id = token.github?.id;
      session.user.email = session.user.email;
      session.user.provider = {
        github: Boolean(token.github),
      };
      return session;
    },
  },
});
