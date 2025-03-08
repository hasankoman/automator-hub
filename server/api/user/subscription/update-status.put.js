import { updateSubscriptionStatus } from "~/server/db/subscription";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);

    const allowedStatuses = ["active", "cancelled"];
    if (!body.status || !allowedStatuses.includes(body.status)) {
      throw createApiError(
        ErrorTypes.BAD_REQUEST,
        "Invalid status. Must be either 'active' or 'cancelled'"
      );
    }

    const subscription = await updateSubscriptionStatus(
      session.user.id,
      body.status
    );

    return createApiResponse(subscription);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Failed to update subscription status",
      error
    );
  }
});
