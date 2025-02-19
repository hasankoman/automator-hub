export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);
    const { planId } = body;

    if (!planId) {
      throw createApiError(ErrorTypes.VALIDATION, "Plan ID is required");
    }

    const subscription = await updateOrCreateSubscription(
      planId,
      session.user.id
    );

    return createApiResponse(subscription);
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
