export const getUserSubscription = (userId) =>
  prisma.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

export const updateOrCreate = async (userId, planId) => {
  try {
    return await prisma.subscription.upsert({
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
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error updating subscription",
      error
    );
  }
};
