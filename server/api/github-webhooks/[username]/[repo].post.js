export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const { isActive } = await readBody(event);
    const { username, repo } = event.context.params;

    console.log("username ->", username);
    console.log("repo ->", repo);
    console.log("isActive ->", isActive);
    console.log("session ->", session);

    const repository = await prisma.monitoredRepository.findFirst({
      where: {
        userId: session.user.id,
        fullName: `${username}/${repo}`,
      },
      select: {
        webhookId: true,
        id: true,
      },
    });

    if (repository?.webhookId) {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/hooks/${repository.webhookId}`,
        {
          method: "PATCH",
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
            Authorization: `Bearer ${session.user.github.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({ active: isActive }),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      console.log("repository id ->", repository.id);

      await prisma.monitoredRepository.update({
        where: {
          id: repository.id,
        },
        data: {
          isActive: isActive,
        },
      });
    }

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to deactivate webhook: ${error.message}`,
      error
    );
  }
});
