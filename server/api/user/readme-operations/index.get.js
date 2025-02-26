import { getUserReadmeOperations } from "~/server/db/readmeOperation";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);

    const operations = await getUserReadmeOperations(session.user.id);

    return createApiResponse(operations);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      error.message || "Failed to fetch readme operations",
      error
    );
  }
});
