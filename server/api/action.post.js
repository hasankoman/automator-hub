import { incrementMetric } from "../db/usage";
import { validateAccess } from "../utils/subscriptionHandler";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const body = await readBody(event);
    const userId = session.user.id;

    await validateAccess(userId, "manualReadme");

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
