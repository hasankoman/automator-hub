import prisma from "./prisma";

export async function getUserUsage(githubId) {
  const user = await prisma.user.findUnique({
    where: {
      githubId: String(githubId),
    },
    include: {
      subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  const usage = await prisma.usage.findUnique({
    where: { userId: user.id },
  });

  return {
    manualReadme: {
      limit: user?.subscription?.plan?.manualReadmeUpdateLimit ?? 0,
      use: usage.manualUpdatesUsed,
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
