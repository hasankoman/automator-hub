export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);

    const monitoredRepos = await prisma.monitoredRepository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const webhooks = [];

    for (const repo of monitoredRepos) {
      const response = await $fetch(
        `https://api.github.com/repos/${repo.fullName}/hooks/${repo.webhookId}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.github.accessToken}`,
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );

      webhooks.push({ ...response, repository: { ...repo } });
    }

    return createApiResponse(webhooks);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to fetch webhooks: ${error.message}`,
      error
    );
  }
});
