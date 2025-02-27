import {
  createReadmeOperation,
  updateReadmeOperation,
} from "../db/readmeOperation";
import { incrementMetric } from "../db/usage";
import { validateAccess } from "../utils/subscriptionHandler";

export default defineEventHandler(async (event) => {
  let readmeOperation;
  try {
    const session = await requireGithubAuth(event);
    const body = await readBody(event);
    const userId = session.user.id;

    await validateAccess(userId, "manualReadme");

    readmeOperation = await createReadmeOperation(
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

    await updateReadmeOperation(readmeOperation.id, "success");

    await incrementMetric(userId, "manualUpdatesUsed");

    return createApiResponse({ success: true });
  } catch (error) {
    await updateReadmeOperation(readmeOperation.id, "failed");
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
