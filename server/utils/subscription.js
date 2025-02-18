import prisma from "./prisma";

export async function getUserSubscription(userId) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    include: {
      plan: true,
    },
  });

  return subscription;
}

export async function updateOrCreateSubscription(planId, userId) {
  try {
    const updatedSubscription = await prisma.subscription.upsert({
      where: { userId },
      update: { planId, updatedAt: new Date() },
      create: {
        userId,
        planId,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "active",
      },
    });

    return updatedSubscription;
  } catch (error) {
    throw error;
  }
}

async function addSubscription(userId, planId) {
  try {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "active",
      },
    });
  } catch (error) {
    console.error("Error adding subscription:", error);
  } finally {
    await prisma.$disconnect();
  }
}
