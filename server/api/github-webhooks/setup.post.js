import { incrementMetric } from "~/server/db/usage";
import { validateAccess } from "../../utils/subscriptionHandler";

export default defineEventHandler(async (event) => {
  try {
    const session = await requireGithubAuth(event);
    const body = await readBody(event);
    const { repository } = body;

    await validateAccess(session.user.id, "autoReadme");

    const response = await $fetch(
      `https://api.github.com/repos/${repository.fullName}/hooks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.github.accessToken}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          name: "web",
          active: true,
          events: ["push"],
          config: {
            url: `${
              useRuntimeConfig().public.appUrl
            }/api/github-webhooks/receive`,
            content_type: "json",
            secret: useRuntimeConfig().webhookSecret,
            insecure_ssl: "0",
          },
        }),
      }
    );

    await prisma.monitoredRepository.upsert({
      where: {
        userId_repositoryId: {
          userId: session.user.id,
          repositoryId: repository.id,
        },
      },
      update: {
        webhookId: response.id,
        isActive: true,
      },
      create: {
        userId: session.user.id,
        repositoryId: repository.id,
        branch: repository.default_branch,
        fullName: repository.fullName,
        webhookId: response.id,
        isActive: true,
      },
    });

    await incrementMetric(session.user.id, "autoReadmeUsed");

    return createApiResponse(response);
  } catch (error) {
    console.error("Webhook setup error:", error);
    throw createApiError(
      ErrorTypes.INTERNAL,
      `Failed to setup webhook: ${error.message}`,
      error
    );
  }
});
