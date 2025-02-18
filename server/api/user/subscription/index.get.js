import { getUserSubscription } from "../../../utils/subscription";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    if (!session) {
      event.node.res.statusCode = 204;
      return null;
    }

    const userId = session.user.id;

    const subscription = await getUserSubscription(userId);

    return subscription;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
