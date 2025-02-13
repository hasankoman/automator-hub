import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  debug: true,
  providers: [
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Parola", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Credentials:", credentials);

          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          if (
            credentials.email === "test@gmail.com" &&
            credentials.password === "1234"
          ) {
            return { id: 1, email: credentials.email };
          }

          throw new Error("Invalid email or password");
        } catch (error) {
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),

    GithubProvider.default({
      clientId: useRuntimeConfig().public.githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
      authorization: {
        params: {
          scope: "read:user public_repo",
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account) {
        if (account.provider === "credentials" && user) {
          token.app = {
            id: user.id,
            email: user.email,
          };
        }
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
      session.user.credentials = token.app || null;
      session.user.github = token.github || null;

      session.user.id = token.app?.id || token.github?.id;
      session.user.email = token.app?.email || session.user.email;

      session.user.provider = {
        credentials: Boolean(token.app),
        github: Boolean(token.github),
      };

      return session;
    },
  },
});
