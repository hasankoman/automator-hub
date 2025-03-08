import { createReadmeHistory } from "~/server/db/readmeHistory";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);

    const operation = await createReadmeHistory(
      session.user.id,
      body.repositoryId,
      body.repositoryName,
      body.operationType,
      body.status
    );

    return createApiResponse(operation);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(
      ErrorTypes.INTERNAL,
      error.message || "Failed to create readme operation",
      error
    );
  }
});
