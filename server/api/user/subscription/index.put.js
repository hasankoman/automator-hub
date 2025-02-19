import { updateOrCreate } from "~/server/db/subscription";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);
    const { planId } = body;

    if (!planId) {
      throw createApiError(ErrorTypes.VALIDATION, "Plan ID is required");
    }

    const subscription = await updateOrCreate(session.user.id, planId);

    return createApiResponse(subscription);
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
