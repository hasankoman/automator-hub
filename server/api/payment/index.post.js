import { updateOrCreate } from "~/server/db/subscription";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireAuth(event);
    const body = await readBody(event);
    const { planId, paymentDetails } = body;

    if (!planId) {
      throw createApiError(ErrorTypes.VALIDATION, "Plan ID is required");
    }

    // Here you would normally process the payment with a payment provider
    // For now, we'll just simulate a successful payment

    // Create or update subscription
    const subscription = await updateOrCreate(session.user.id, planId);

    return createApiResponse({
      success: true,
      subscription,
      paymentDetails,
    });
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(ErrorTypes.INTERNAL, "Payment failed", error);
  }
});
