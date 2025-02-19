export const getUserSubscription = (userId) =>
  prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

export const updateOrCreate = async (userId, planId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const subscription = await tx.subscription.upsert({
        where: { userId },
        update: {
          planId,
          updatedAt: new Date(),
        },
        create: {
          userId,
          planId,
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: "active",
        },
      });

      await tx.usage.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          lastResetDate: new Date(),
          manualUpdatesUsed: 0,
        },
      });

      return subscription;
    });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error updating subscription",
      error
    );
  }
};
