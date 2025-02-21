export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const { username, repo } = event.context.params;

    const response = await $fetch(
      `https://api.github.com/repos/${username}/${repo}/hooks`,
      {
        headers: {
          Authorization: `Bearer ${session.user.github.accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const hooks = response.filter(
      (hook) =>
        hook.config.url ===
        `${useRuntimeConfig().public.appUrl}/api/github-webhooks/receive`
    );

    return createApiResponse(hooks);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to fetch webhooks: ${error.message}`,
      error
    );
  }
});
