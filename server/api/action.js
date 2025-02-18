import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.github?.accessToken) {
    return { error: { message: "Unauthorized", statusCode: 401 } };
  }

  if (event.req.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const token = session?.user?.github?.accessToken;

  try {
    const githubId = session.user.github.id;

    const usage = await getUserUsage(githubId);

    if (usage.manualReadme.use >= usage.manualReadme.limit) {
      throw createError({
        statusCode: 500,
        statusMessage: "Usage limit reached!",
      });
    }

    await $fetch(useRuntimeConfig().public.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body,
    });

    await incrementUsage(String(githubId), "readmeUpdates");

    return response;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
