export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const user = await getUserById(session.user.id);

    return createApiResponse(user);
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
