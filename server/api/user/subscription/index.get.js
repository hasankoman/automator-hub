import { getUserSubscription } from "~/server/db/subscription";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const subscription = await getUserSubscription(session.user.id);

    return createApiResponse(subscription);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
