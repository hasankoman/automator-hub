export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const githubEvent = event.headers.get("x-github-event");

    const signature = event.headers.get("x-hub-signature-256");
    if (!verifyWebhookSignature(body, signature)) {
      throw createApiError(
        ErrorTypes.UNAUTHORIZED,
        "Invalid webhook signature"
      );
    }

    const repository = await prisma.monitoredRepository.findFirst({
      where: {
        fullName: body.repository.full_name,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!repository) {
      throw createApiError(
        ErrorTypes.NOT_FOUND,
        "Repository not found or webhook inactive"
      );
    }

    switch (githubEvent) {
      case "push":
        if (
          body.ref === `refs/heads/${repository.branch}` &&
          !body.commits[0].message.includes("readme file updated")
        ) {
          await $fetch(useRuntimeConfig().public.webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: repository.user.githubToken,
            },
            body: {
              defaultBranch: body.repository.default_branch,
              fullName: body.repository.full_name,
            },
          });
        }
        break;
    }

    return createApiResponse({ success: true });
  } catch (error) {
    throw createApiError(ErrorTypes.INTERNAL, error.message, error);
  }
});
