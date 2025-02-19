import { getUserUsage } from "~/server/db/usage";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const usage = await getUserUsage(session.user.id);

    return createApiResponse(usage);
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
