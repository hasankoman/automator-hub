export const getByGithubId = (githubId) =>
  prisma.user.findUnique({ where: { githubId: String(githubId) } });

export const getById = (id) => prisma.user.findUnique({ where: { id } });

export const createOrUpdateFromGithub = (profile) =>
  prisma.user.upsert({
    where: { githubId: String(profile.id) },
    update: {
      email: profile.email,
      name: profile.name,
      githubUsername: profile.login,
    },
    create: {
      email: profile.email,
      name: profile.name,
      githubId: String(profile.id),
      githubUsername: profile.login,
    },
  });
