export const getUserSubscription = (userId) =>
  prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

export const updateOrCreate = async (userId, planId) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const currentSubscription = await tx.subscription.findUnique({
        where: { userId },
        include: { plan: true },
      });

      const currentUsage = await tx.usage.findUnique({
        where: { userId },
      });

      if (currentSubscription && currentSubscription.planId !== planId) {
        await tx.subscriptionHistory.create({
          data: {
            userId,
            planId: currentSubscription.planId,
            manualUpdatesUsed: currentUsage?.manualUpdatesUsed || 0,
            autoReadmeUsed: currentUsage?.autoReadmeUsed || 0,
          },
        });

        const previousUsage = await tx.subscriptionHistory.findFirst({
          where: {
            userId,
            planId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

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
            manualUpdatesUsed: previousUsage
              ? previousUsage.manualUpdatesUsed
              : 0,
            autoReadmeUsed: previousUsage ? previousUsage.autoReadmeUsed : 0,
          },
          create: {
            userId,
            lastResetDate: new Date(),
            manualUpdatesUsed: previousUsage
              ? previousUsage.manualUpdatesUsed
              : 0,
            autoReadmeUsed: previousUsage ? previousUsage.autoReadmeUsed : 0,
          },
        });

        return subscription;
      } else {
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

        if (!currentUsage) {
          await tx.usage.create({
            data: {
              userId,
              lastResetDate: new Date(),
              manualUpdatesUsed: 0,
              autoReadmeUsed: 0,
            },
          });
        }

        return subscription;
      }
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
