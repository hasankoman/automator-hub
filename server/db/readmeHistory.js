export const getUserReadmeHistory = async (userId) => {
  const operations = await prisma.readmeOperation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return operations;
};

export const createReadmeHistory = async (
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

export const updateReadmeHistory = async (id, status) => {
  return await prisma.readmeOperation.update({
    where: { id },
    data: { status },
  });
};
