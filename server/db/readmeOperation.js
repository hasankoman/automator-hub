export const getUserReadmeOperations = (userId) =>
  prisma.readmeOperation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

export const createReadmeOperation = async (
  userId,
  repositoryId,
  repositoryName,
  operationType,
  status
) => {
  try {
    return await prisma.readmeOperation.create({
      data: { userId, repositoryId, repositoryName, operationType, status },
    });
  } catch (error) {
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Failed to create readme operation",
      error
    );
  }
};
