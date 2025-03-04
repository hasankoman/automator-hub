import { handleSubscriptions } from "../handlers/subscriptionHandler";
import { defineCronHandler } from "#nuxt/cron";

export default defineCronHandler("everySixHours", handleSubscriptions);
