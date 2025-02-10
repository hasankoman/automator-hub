import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.accessToken) {
    return { error: { message: "Unauthorized", statusCode: 401 } };
  }

  if (event.req.method !== "POST") {
    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  }

  const body = await readBody(event);
  const token = session.user.accessToken;

  const payload = {
    token,
    ...body,
  };

  try {
    const response = await $fetch(
      "https://hasankoman.app.n8n.cloud/webhook-test/b2e08263-ce55-46a5-b8b4-fd683aebe2bb",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );
    return response;
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
