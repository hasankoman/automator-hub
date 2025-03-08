import supabase from "../utils/supabase";
import { createApiError, ErrorTypes } from "../utils/errorHandler";

export const getUserSubscription = async (userId) => {
  const { data, error } = await supabase
    .from("Subscription")
    .select(
      `
      *,
      plan:Plan(*)
    `
    )
    .eq("userId", userId)
    .single();

  if (error) return null;
  return data;
};

export const updateOrCreate = async (userId, planId) => {
  try {
    // Supabase doesn't support transactions in the same way as Prisma
    // We'll need to handle this with separate operations

    // Get current subscription
    const { data: currentSubscription, error: subError } = await supabase
      .from("Subscription")
      .select(
        `
        *,
        plan:Plan(*)
      `
      )
      .eq("userId", userId)
      .single();

    // Get current usage
    const { data: currentUsage, error: usageError } = await supabase
      .from("Usage")
      .select("*")
      .eq("userId", userId)
      .single();

    if (currentSubscription && currentSubscription.planId !== planId) {
      // Create subscription history record
      await supabase.from("SubscriptionHistory").insert({
        userId: userId,
        planId: currentSubscription.planId,
        manualUpdatesUsed: currentUsage?.manualUpdatesUsed || 0,
        autoReadmeUsed: currentUsage?.autoReadmeUsed || 0,
        createdAt: new Date().toISOString(),
      });

      // Find previous usage with this plan
      const { data: previousUsage, error: prevUsageError } = await supabase
        .from("SubscriptionHistory")
        .select("*")
        .eq("userId", userId)
        .eq("planId", planId)
        .order("createdAt", { ascending: false })
        .limit(1)
        .single();

      // Update or create subscription
      const startDate = new Date().toISOString();
      const endDate = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString();

      let subscription;
      if (currentSubscription) {
        // Update existing subscription
        const { data: updatedSub, error: updateSubError } = await supabase
          .from("Subscription")
          .update({
            planId: planId,
            updatedAt: new Date().toISOString(),
            startDate: startDate,
            endDate: endDate,
            status: "active",
          })
          .eq("userId", userId)
          .select(
            `
            *,
            plan:Plan(*)
          `
          )
          .single();

        if (updateSubError) throw updateSubError;
        subscription = updatedSub;
      } else {
        // Create new subscription
        const { data: newSub, error: newSubError } = await supabase
          .from("Subscription")
          .insert({
            userId: userId,
            planId: planId,
            startDate: startDate,
            endDate: endDate,
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select(
            `
            *,
            plan:Plan(*)
          `
          )
          .single();

        if (newSubError) throw newSubError;
        subscription = newSub;
      }

      // Update or create usage
      if (currentUsage) {
        await supabase
          .from("Usage")
          .update({
            lastResetDate: new Date().toISOString(),
            manualUpdatesUsed: previousUsage
              ? previousUsage.manualUpdatesUsed
              : 0,
            autoReadmeUsed: previousUsage ? previousUsage.autoReadmeUsed : 0,
            updatedAt: new Date().toISOString(),
          })
          .eq("userId", userId);
      } else {
        await supabase.from("Usage").insert({
          userId: userId,
          lastResetDate: new Date().toISOString(),
          manualUpdatesUsed: previousUsage
            ? previousUsage.manualUpdatesUsed
            : 0,
          autoReadmeUsed: previousUsage ? previousUsage.autoReadmeUsed : 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      return subscription;
    } else {
      // Case where either there's no current subscription or plan hasn't changed
      // Create or update subscription
      const startDate = new Date().toISOString();
      const endDate = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ).toISOString();

      let subscription;
      if (currentSubscription) {
        // Update existing subscription
        const { data: updatedSub, error: updateSubError } = await supabase
          .from("Subscription")
          .update({
            planId: planId,
            updatedAt: new Date().toISOString(),
            startDate: startDate,
            endDate: endDate,
            status: "active",
          })
          .eq("userId", userId)
          .select(
            `
            *,
            plan:Plan(*)
          `
          )
          .single();

        if (updateSubError) throw updateSubError;
        subscription = updatedSub;
      } else {
        // Create new subscription
        const { data: newSub, error: newSubError } = await supabase
          .from("Subscription")
          .insert({
            userId: userId,
            planId: planId,
            startDate: startDate,
            endDate: endDate,
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .select(
            `
            *,
            plan:Plan(*)
          `
          )
          .single();

        if (newSubError) throw newSubError;
        subscription = newSub;
      }

      // Create or update usage
      if (currentUsage) {
        await supabase
          .from("Usage")
          .update({
            lastResetDate: new Date().toISOString(),
            manualUpdatesUsed: 0,
            autoReadmeUsed: 0,
            updatedAt: new Date().toISOString(),
          })
          .eq("userId", userId);
      } else {
        await supabase.from("Usage").insert({
          userId: userId,
          lastResetDate: new Date().toISOString(),
          manualUpdatesUsed: 0,
          autoReadmeUsed: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      return subscription;
    }
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
    const { data, error } = await supabase
      .from("Subscription")
      .update({
        status,
        updatedAt: new Date().toISOString(),
      })
      .eq("userId", userId)
      .select(
        `
        *,
        plan:Plan(*)
      `
      )
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error updating subscription status",
      error
    );
  }
};
