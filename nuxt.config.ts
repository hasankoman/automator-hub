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
    "@nuxtjs/device",
    "@nuxt/fonts",
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
              500: "{surface.500}",
              600: "{surface.600}",
              700: "{surface.700}",
              800: "{surface.800}",
              900: "{surface.900}",
              950: "{surface.950}",
            },
            colorScheme: {
              light: {
                primary: {
                  color: "{primary.950}",
                  contrastColor: "#ffffff",
                  hoverColor: "{primary.900}",
                  activeColor: "{primary.800}",
                },
                highlight: {
                  background: "{primary.950}",
                  focusBackground: "{primary.700}",
                  color: "#ffffff",
                  focusColor: "#ffffff",
                },
              },
              dark: {
                primary: {
                  color: "{primary.50}",
                  contrastColor: "{primary.950}",
                  hoverColor: "{primary.100}",
                  activeColor: "{primary.200}",
                },
                highlight: {
                  background: "{primary.50}",
                  focusBackground: "{primary.300}",
                  color: "{primary.950}",
                  focusColor: "{primary.950}",
                },
              },
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
  css: ["~/assets/css/main.css", "animate.css"],
  compatibilityDate: "2025-02-06",
});
