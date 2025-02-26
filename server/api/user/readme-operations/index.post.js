import { createOrUpdateReadmeOperation } from "~/server/db/readmeOperation";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);

    const operation = await createOrUpdateReadmeOperation(
      session.user.id,
      body.repositoryId,
      body.repositoryName,
      body.operationType,
      body.status
    );

    return createApiResponse(operation);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      error.message || "Failed to create readme operation",
      error
    );
  }
});
