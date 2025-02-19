export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);

    const body = await readBody(event);
    const userId = session.user.id;
    const usage = await getUserUsage(userId);

    if (usage.manualReadme.used >= usage.manualReadme.limit) {
      throw createApiError(
        ErrorTypes.PLAN_LIMIT_REACHED,
        "You've reached your plan's action limit. Please upgrade to continue."
      );
    }

    await $fetch(useRuntimeConfig().public.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session.user.github.accessToken,
      },
      body,
    });

    await incrementMetric(userId, "manualUpdatesUsed");

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
