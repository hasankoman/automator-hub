import { createReadmeHistory, updateReadmeHistory } from "../db/readmeHistory";
import { incrementMetric } from "../db/usage";
import { validateAccess } from "../utils/subscriptionHandler";

export default defineEventHandler(async (event) => {
  let readmeHistory;
  try {
    const session = await requireGithubAuth(event);
    const body = await readBody(event);
    const userId = session.user.id;

    await validateAccess(userId, "manualReadme");

    readmeHistory = await createReadmeHistory(
      userId,
      body.id,
      body.name,
      "manual",
      "pending"
    );

    await $fetch(useRuntimeConfig().public.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: session.user.github.accessToken,
      },
      body,
    });

    await updateReadmeHistory(readmeHistory.id, "success");

    await incrementMetric(userId, "manualUpdatesUsed");

    return createApiResponse({ success: true });
  } catch (error) {
    if (readmeHistory) {
      await updateReadmeHistory(readmeHistory.id, "failed");
    }
    // Preserve the original error if it has a statusCode
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
