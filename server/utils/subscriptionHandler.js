import { createApiError, ErrorTypes } from "./errorHandler";

export const checkAccess = async (userId, feature) => {
  try {
    const usage = await prisma.usage.findUnique({
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

    if (!usage?.user?.subscription) {
      throw createApiError(
        ErrorTypes.NOT_FOUND,
        "No active subscription found"
      );
    }

    const { subscription } = usage.user;

    switch (feature) {
      case "manualReadme":
        return {
          hasAccess:
            usage.manualUpdatesUsed < subscription.plan.manualReadmeUpdateLimit,
          limit: subscription.plan.manualReadmeUpdateLimit,
          used: usage.manualUpdatesUsed,
          remaining:
            subscription.plan.manualReadmeUpdateLimit - usage.manualUpdatesUsed,
        };

      case "autoReadme":
        return {
          hasAccess:
            subscription.plan.allowAutoReadme &&
            usage.autoReadmeUsed < subscription.plan.autoReadmeUpdateLimit,
          reason: subscription.plan.allowAutoReadme
            ? null
            : "Feature not available in your plan",
        };

      // Add more feature checks as needed
      default:
        throw createApiError(
          ErrorTypes.VALIDATION,
          `Unknown feature: ${feature}`
        );
    }
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Failed to check feature access",
      error
    );
  }
};

export const validateAccess = async (userId, feature) => {
  const access = await checkAccess(userId, feature);

  if (!access.hasAccess) {
    throw createApiError(
      ErrorTypes.PLAN_LIMIT_REACHED,
      access.reason || `You've reached your plan's ${feature} limit`
    );
  }

  return access;
};
