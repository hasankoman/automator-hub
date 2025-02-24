export const getByGithubId = (githubId) =>
  prisma.user.findUnique({ where: { githubId: String(githubId) } });

export const getById = (id) => prisma.user.findUnique({ where: { id } });

export const createOrUpdateFromGithub = (profile, accessToken) => {
  const encryptedAccessToken = encrypt(accessToken);

  return prisma.user.upsert({
    where: { githubId: String(profile.id) },
    update: {
      email: profile.email,
      name: profile.name,
      githubUsername: profile.login,
      githubToken: encryptedAccessToken,
    },
    create: {
      email: profile.email,
      name: profile.name,
      githubId: String(profile.id),
      githubUsername: profile.login,
      githubToken: encryptedAccessToken,
    },
  });
};

export const deleteUser = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        usage: true,
        subscription: true,
      },
    });

    if (!user) {
      throw createApiError(ErrorTypes.NOT_FOUND, "User not found");
    }

    const deleteOperations = [];

    if (user.usage) {
      deleteOperations.push(prisma.usage.delete({ where: { userId: id } }));
    }

    if (user.subscription) {
      deleteOperations.push(
        prisma.subscription.delete({ where: { userId: id } })
      );
    }

    deleteOperations.push(prisma.user.delete({ where: { id } }));

    await prisma.$transaction(deleteOperations);
  } catch (error) {
    if (error.statusCode) throw error;
    throw createApiError(
      ErrorTypes.INTERNAL,
      "Error deleting user account",
      error
    );
  }
};

export const createOrGetFromGithub = async (profile, accessToken) => {
  const encryptedAccessToken = encrypt(accessToken);
  const existingUser = await getByGithubId(profile.id);
  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: { githubToken: encryptedAccessToken },
    });
  }

  return prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      githubId: String(profile.id),
      githubUsername: profile.login,
      githubToken: encryptedAccessToken,
    },
  });
};
