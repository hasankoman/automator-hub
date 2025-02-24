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
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { githubToken: true },
    });

    if (!user?.githubToken) {
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
