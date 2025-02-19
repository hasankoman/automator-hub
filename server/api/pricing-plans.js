export default defineEventHandler(async (event) => {
  try {
    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    return createApiResponse(plans);
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error fetching pricing plans",
      error
    );
  }
});
