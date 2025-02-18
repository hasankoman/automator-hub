import { getUserUsage } from "../../../utils/usage";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      event.node.res.statusCode = 204;
      return null;
    }

    const userId = session.user.id;

    const usage = await getUserUsage(userId);

    return usage;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
