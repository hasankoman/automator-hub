import { incrementUsage } from "../../../utils/usage";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    console.log(session);

    if (!session) {
      event.node.res.statusCode = 204;
      return null;
    }

    const { metric } = readBody(event);

    const githubId = session.user.github.id;

    console.log("metric ->" + metric);

    const usage = await incrementUsage(String(githubId), metric);

    return usage;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
