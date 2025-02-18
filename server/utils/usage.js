import prisma from "./prisma";

export async function getUserUsage(userId) {
  const userUsage = await prisma.usage.findUnique({
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

  if (!userUsage || !userUsage.user || !userUsage.user.subscription) {
    throw new Error("Usage or user data not found");
  }

  return {
    manualReadme: {
      limit: userUsage.user.subscription.plan.manualReadmeUpdateLimit,
      used: userUsage.manualUpdatesUsed,
      lastResetDate: userUsage.lastResetDate,
    },
  };
}

export async function incrementUsage(githubId, metric) {
  const user = await prisma.user.findUnique({
    where: {
      githubId,
    },
  });

  await prisma.usage.update({
    where: { userId: user.id },
    data: { manualUpdatesUsed: { increment: 1 } },
  });
}
