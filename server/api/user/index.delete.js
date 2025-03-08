import { deleteUser } from "~/server/db/user";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    await deleteUser(session.user.id);

    return createApiResponse({ success: true });
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
