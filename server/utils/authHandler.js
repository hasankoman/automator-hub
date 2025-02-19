import { getServerSession } from "#auth";
import { createApiError, ErrorTypes } from "../utils/errorHandler";

export const requireAuth = async (event) => {
  const session = await getServerSession(event);

  if (!session) {
    throw createApiError(ErrorTypes.UNAUTHORIZED);
  }

  return session;
};

export const requireGithubAuth = async (event) => {
  const session = await requireAuth(event);

  if (!session?.user?.github?.accessToken) {
    throw createApiError(
      ErrorTypes.UNAUTHORIZED,
      "GitHub authentication required"
    );
  }

  return session;
};
