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
    // Burada iptal edilen abonelikler için işlem yapılabilir
  }
}

async function handleNonCancelledSubscriptions(subscriptions) {
  for (const subscription of subscriptions) {
    try {
      // Burada ödeme işlemi yapılabilir
      console.log(`Attempting payment for subscription ${subscription.id}`);
    } catch (error) {
      console.error(
        `Payment failed for subscription ${subscription.id}:`,
        error
      );
    }
  }
}
