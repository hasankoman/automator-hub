export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const subscription = await getUserSubscription(session.user.id);

    return createApiResponse(subscription);
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
