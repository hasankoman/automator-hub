import { defineNitroPlugin } from "nitropack/runtime/plugin";
import subscriptionJob from "./jobs/subscriptionJob";
import cron from "node-cron";

const jobs = [subscriptionJob];

export default defineNitroPlugin(() => {
  const isDev = process.env.NODE_ENV === "development";

  for (const job of jobs) {
    const schedule = isDev ? job.schedule.development : job.schedule.production;

    console.log(`Setting up cron job '${job.name}' with schedule: ${schedule}`);

    cron.schedule(schedule, async () => {
      try {
        console.log(`Running ${job.name}:`, new Date().toISOString());
        await job.handler();
      } catch (error) {
        if (job.onError) {
          job.onError(error);
        } else {
          console.error(`Error in ${job.name}:`, error);
        }
      }
    });
  }
});
