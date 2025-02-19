export const getPlans = () =>
  prisma.plan.plan({
    where: {
      isActive: true,
    },
    orderBy: {
      price: "asc",
    },
  });
