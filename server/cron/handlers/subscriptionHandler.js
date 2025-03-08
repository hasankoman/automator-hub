import { updateOrCreate } from "~/server/db/subscription";
import supabase from "~/server/utils/supabase";

export const handleSubscriptions = async () => {
  try {
    const { data: cancelledExpiredSubscriptions, error: cancelledError } =
      await supabase
        .from("Subscription")
        .select("*, user:User(*), plan:Plan(*)")
        .lte("endDate", new Date().toISOString())
        .eq("status", "cancelled");

    if (cancelledError) throw cancelledError;

    const { data: nonCancelledExpiredSubscriptions, error: nonCancelledError } =
      await supabase
        .from("Subscription")
        .select("*, user:User(*), plan:Plan(*)")
        .lte("endDate", new Date().toISOString())
        .neq("status", "cancelled");

    if (nonCancelledError) throw nonCancelledError;

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
      const { data: freePlan, error: freePlanError } = await supabase
        .from("Plan")
        .select("*")
        .eq("isFree", true)
        .single();

      if (freePlanError) throw freePlanError;

      if (freePlan) {
        const { data: currentUsage, error: usageError } = await supabase
          .from("Usage")
          .select("*")
          .eq("userId", subscription.userId)
          .single();

        if (usageError) throw usageError;

        await supabase.from("SubscriptionHistory").insert({
          userId: subscription.userId,
          planId: subscription.planId,
          manualUpdatesUsed: currentUsage?.manualUpdatesUsed || 0,
          autoReadmeUsed: currentUsage?.autoReadmeUsed || 0,
          createdAt: new Date().toISOString(),
        });

        await supabase
          .from("subscriptions")
          .update({
            planId: freePlan.id,
            status: "active",
            startDate: new Date().toISOString(),
            endDate: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .eq("id", subscription.id);

        await supabase
          .from("Usage")
          .update({
            lastResetDate: new Date().toISOString(),
            manualUpdatesUsed: 0,
            autoReadmeUsed: 0,
            updatedAt: new Date().toISOString(),
          })
          .eq("userId", subscription.userId);
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
      await updateOrCreate(subscription.userId, subscription.planId);
      if (!subscription.plan.isFree) {
        console.log(`Attempting payment for subscription ${subscription.id}`);
      }
    } catch (error) {
      console.error(
        `Payment failed for subscription ${subscription.id}:`,
        error
      );
    }
  }
}
