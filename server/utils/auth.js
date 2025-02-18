import prisma from "./prisma";

export async function getOrCreateUser(profile) {
  const user = await prisma.user.upsert({
    where: {
      githubId: String(profile.id),
    },
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
  return user;
}

export async function getUserByGithubId(githubId) {
  return prisma.user.findUnique({
    where: {
      githubId: String(githubId),
    },
  });
}

export async function getUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}
