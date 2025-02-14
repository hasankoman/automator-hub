import prisma from "../utils/prisma";

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
    return plans;
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    throw createError({
      statusCode: 500,
      message: "Error fetching pricing plans",
    });
  }
});
