import { Analytics } from "@vercel/analytics/nuxt";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("Analytics", Analytics);
});
