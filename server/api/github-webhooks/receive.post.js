export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const githubEvent = event.headers.get("x-github-event");

    const signature = event.headers.get("x-hub-signature-256");
    if (!verifyWebhookSignature(body, signature)) {
      throw createApiError(
        ErrorTypes.UNAUTHORIZED,
        "Invalid webhook signature"
      );
    }

    switch (githubEvent) {
      case "push":
        await handlePushEvent(body);
        break;
    }

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
