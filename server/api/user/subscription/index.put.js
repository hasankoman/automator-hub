import { updateOrCreateSubscription } from "../../../utils/subscription";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
  try {
    const session = await getServerSession(event);

    const body = await readBody(event);

    const { planId } = body;

    if (!session) {
      event.node.res.statusCode = 204;
      return null;
    }

    const userId = session.user.id;

    const subscription = await updateOrCreateSubscription(planId, userId);

    return subscription;
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
