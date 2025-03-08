import { getById } from "~/server/db/user";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const user = await getById(session.user.id);

    return createApiResponse(user);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
