import supabase from "../utils/supabase.js";
import { createApiError, ErrorTypes } from "../utils/errorHandler";

export const getUserUsage = async (userId) => {
  try {
    const { data: usage, error } = await supabase
      .from("Usage")
      .select(
        `
        *,
        user:User(
          *,
          subscription:Subscription(
            *,
            plan:Plan(*)
          )
        )
      `
      )
      .eq("userId", userId)
      .single();

    if (error || !usage) {
      return null;
    }

    if (!usage.user?.subscription) {
      throw createApiError(ErrorTypes.NOT_FOUND, "Subscription not found");
    }

    return {
      manualReadme: {
        limit: usage.user.subscription.plan.manualReadmeUpdateLimit,
        used: usage.manualUpdatesUsed,
        lastResetDate: usage.lastResetDate,
      },
      autoReadme: {
        limit: usage.user.subscription.plan.autoReadmeUpdateLimit,
        used: usage.autoReadmeUsed,
        lastResetDate: usage.lastResetDate,
      },
    };
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, "Error fetching usage", error);
  }
};

export const incrementMetric = async (userId, metric) => {
  try {
    // Supabase doesn't support direct incrementing like Prisma
    // We need to get the current value and then update it
    const metricMapping = {
      manualUpdatesUsed: "manualUpdatesUsed",
      autoReadmeUsed: "autoReadmeUsed",
    };

    const supabaseMetric = metricMapping[metric];
    if (!supabaseMetric) {
      throw createApiError(ErrorTypes.INTERNAL, "Invalid metric name");
    }

    // Get current value
    const { data: currentUsage, error: getError } = await supabase
      .from("Usage")
      .select(supabaseMetric)
      .eq("userId", userId)
      .single();

    if (getError) throw getError;

    // Increment and update
    const { data, error: updateError } = await supabase
      .from("Usage")
      .update({
        [supabaseMetric]: (currentUsage[supabaseMetric] || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
      .eq("userId", userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error incrementing usage",
      error
    );
  }
};

export const decrementMetric = async (userId, metric) => {
  try {
    // Supabase doesn't support direct decrementing like Prisma
    // We need to get the current value and then update it
    const metricMapping = {
      manualUpdatesUsed: "manualUpdatesUsed",
      autoReadmeUsed: "autoReadmeUsed",
    };

    const supabaseMetric = metricMapping[metric];
    if (!supabaseMetric) {
      throw createApiError(ErrorTypes.INTERNAL, "Invalid metric name");
    }

    // Get current value
    const { data: currentUsage, error: getError } = await supabase
      .from("Usage")
      .select(supabaseMetric)
      .eq("userId", userId)
      .single();

    if (getError) throw getError;

    // Only decrement if greater than 0
    const newValue = Math.max(0, (currentUsage[supabaseMetric] || 0) - 1);

    // Update with decremented value
    const { data, error: updateError } = await supabase
      .from("Usage")
      .update({
        [supabaseMetric]: newValue,
        updatedAt: new Date().toISOString(),
      })
      .eq("userId", userId)
      .select()
      .single();

    if (updateError) throw updateError;
    return data;
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error decrementing usage",
      error
    );
  }
};
