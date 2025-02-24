import { handleSubscriptions } from "../handlers/subscriptionHandler";

export default {
  name: "subscription-check",
  schedule: {
    development: "* * * * *", // Her dakika (development)
    production: "0 0 * * *", // Her gün gece yarısı (production)
  },
  handler: handleSubscriptions,
  onError: (error) => {
    console.error("Error in subscription check job:", error);
  },
};
