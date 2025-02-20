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
        include: { plan: true },
        update: {
          planId,
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          status: "active",
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
        update: {
          lastResetDate: new Date(),
          manualUpdatesUsed: 0,
        },
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

export const updateSubscriptionStatus = async (userId, status) => {
  try {
    return await prisma.subscription.update({
      where: {
        userId,
      },
      data: {
        status,
      },
      include: {
        plan: true,
      },
    });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error updating subscription status",
      error
    );
  }
};
