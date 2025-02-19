export const getPlans = () =>
  prisma.plan.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
  });
