<script setup>
useHead({
  titleTemplate: (productCategory) => {
    return productCategory
      ? `${productCategory} - Automator Hub`
      : "Automator Hub";
  },
});

import { Analytics } from "@vercel/analytics/nuxt";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>
<template>
  <Loading />
  <Toast
    position="top-right"
    :breakpoints="{
      '1024px': { width: '30vw' },
      '768px': { width: '50vw' },
      '576px': { width: '75vw' },
    }"
  />
  <div class="flex items-center justify-center h-dvh w-dvw bg-black">
    <NuxtPage />
  </div>
  <SpeedInsights />
  <Analytics />
</template>
