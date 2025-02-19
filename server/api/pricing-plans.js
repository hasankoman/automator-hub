export default defineEventHandler(async (event) => {
  try {
    const plans = await getPlans();

    return createApiResponse(plans);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error fetching pricing plans",
      error
    );
  }
});
