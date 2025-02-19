export const getUserUsage = async (userId) => {
  try {
    const usage = await prisma.usage.findUnique({
      where: { userId },
      include: {
        user: {
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (!usage.user?.subscription) {
      throw createApiError(ErrorTypes.NOT_FOUND, "Subscription not found");
    }

    return {
      manualReadme: {
        limit: usage.user.subscription.plan.manualReadmeUpdateLimit,
        used: usage.manualUpdatesUsed,
        lastResetDate: usage.lastResetDate,
      },
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, "Error fetching usage", error);
  }
};

export const incrementMetric = async (userId, metric) => {
  try {
    return await prisma.usage.update({
      where: { userId },
      data: { [metric]: { increment: 1 } },
    });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error incrementing usage",
      error
    );
  }
};
