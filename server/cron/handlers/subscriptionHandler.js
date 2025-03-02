export const handleSubscriptions = async () => {
  try {
    const cancelledExpiredSubscriptions = await prisma.subscription.findMany({
      where: {
        endDate: { lte: new Date() },
        status: "cancelled",
      },
      include: { user: true, plan: true },
    });

    const nonCancelledExpiredSubscriptions = await prisma.subscription.findMany(
      {
        where: {
          endDate: { lte: new Date() },
          status: { not: "cancelled" },
        },
        include: { user: true, plan: true },
      }
    );

    console.log(
      `Found ${cancelledExpiredSubscriptions.length} cancelled expired subscriptions`
    );
    console.log(
      `Found ${nonCancelledExpiredSubscriptions.length} non-cancelled expired subscriptions`
    );

    await handleCancelledSubscriptions(cancelledExpiredSubscriptions);
    await handleNonCancelledSubscriptions(nonCancelledExpiredSubscriptions);
  } catch (error) {
    console.error("Error handling expired subscriptions:", error);
  }
};

async function handleCancelledSubscriptions(subscriptions) {
  for (const subscription of subscriptions) {
    try {
      const freePlan = await prisma.plan.findFirst({
        where: { isFree: true },
      });

      if (freePlan) {
        const currentUsage = await prisma.usage.findUnique({
          where: { userId: subscription.userId },
        });

        await prisma.subscriptionHistory.create({
          data: {
            userId: subscription.userId,
            planId: subscription.planId,
            manualUpdatesUsed: currentUsage?.manualUpdatesUsed || 0,
            autoReadmeUsed: currentUsage?.autoReadmeUsed || 0,
          },
        });

        const previousFreeUsage = await prisma.subscriptionHistory.findFirst({
          where: {
            userId: subscription.userId,
            planId: freePlan.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            planId: freePlan.id,
            status: "active",
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          },
        });

        await prisma.usage.update({
          where: { userId: subscription.userId },
          data: {
            lastResetDate: new Date(),
            manualUpdatesUsed: previousFreeUsage
              ? previousFreeUsage.manualUpdatesUsed
              : 0,
            autoReadmeUsed: previousFreeUsage
              ? previousFreeUsage.autoReadmeUsed
              : 0,
          },
        });
      }
    } catch (error) {
      console.error(
        `Error handling cancelled subscription ${subscription.id}:`,
        error
      );
    }
  }
}

async function handleNonCancelledSubscriptions(subscriptions) {
  for (const subscription of subscriptions) {
    try {
      console.log(`Attempting payment for subscription ${subscription.id}`);
    } catch (error) {
      console.error(
        `Payment failed for subscription ${subscription.id}:`,
        error
      );
    }
  }
}
