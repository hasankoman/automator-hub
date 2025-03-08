import { getServerSession } from "#auth";
import { createApiError, ErrorTypes } from "../utils/errorHandler";
import supabase from "./supabase";

export const requireAuth = async (event) => {
  const session = await getServerSession(event);
  console.log("session", session);
  if (!session) {
    throw createApiError(ErrorTypes.UNAUTHORIZED);
  }

  return session;
};

export const requireGithubAuth = async (event) => {
  const session = await requireAuth(event);

  if (!session?.user?.github?.accessToken) {
    const { data: user, error: userError } = await supabase
      .from("User")
      .select("githubToken")
      .eq("id", session.user.id)
      .single();

    if (userError || !user?.githubToken) {
      throw createApiError(
        ErrorTypes.UNAUTHORIZED,
        "GitHub authentication required"
      );
    }

    session.user.github = {
      ...session.user.github,
      accessToken: decrypt(user.githubToken),
    };
  }

  return session;
};
