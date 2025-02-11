import tailwindcss from "@tailwindcss/vite";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

export default defineNuxtConfig({
  modules: [
    "@element-plus/nuxt",
    "@sidebase/nuxt-auth",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@primevue/nuxt-module",
  ],
  primevue: {
    options: {
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: "{surface.50}",
              100: "{surface.100}",
              200: "{surface.200}",
              300: "{surface.300}",
              400: "{surface.400}",
              500: "{surface.950}",
              600: "{surface.950}",
              700: "{surface.950}",
              800: "{surface.950}",
              900: "{surface.950}",
              950: "{surface.950}",
            },
            formField: {
              borderRadius: "{border.radius.xl}",
            },
          },
        }),
        options: {
          prefix: "p",
          darkModeSelector: "dsadas",
          cssLayer: false,
        },
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: "AUTH_ORIGIN",
    baseURL: process.env.AUTH_ORIGIN,
    sessionRefresh: {
      enablePeriodically: 60000,
      enableOnWindowFocus: true,
    },
  },
  runtimeConfig: {
    public: {
      githubClientId: process.env.GITHUB_CLIENT_ID,
      webhookUrl: process.env.WEBHOOK_URL,
    },
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    authSecret: process.env.AUTH_SECRET,
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2025-02-06",
});
