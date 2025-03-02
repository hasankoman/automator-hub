import { getUserReadmeHistory } from "~/server/db/readmeOperation";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);

    const operations = await getUserReadmeHistory(session.user.id);

    return createApiResponse(operations);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      error.message || "Failed to fetch readme operations",
      error
    );
  }
});
