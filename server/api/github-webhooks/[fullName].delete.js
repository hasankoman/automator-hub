export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const { fullName } = event.context.params;

    await prisma.monitoredRepository.updateMany({
      where: {
        userId: session.user.id,
        fullName,
      },
      data: {
        isActive: false,
        webhookId: null,
      },
    });

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to remove webhook: ${error.message}`,
      error
    );
  }
});
