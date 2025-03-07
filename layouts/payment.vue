<script setup>
import { Analytics } from "@vercel/analytics/nuxt";
import { SpeedInsights } from "@vercel/speed-insights/nuxt";

useHead({
  title: "Payment - Automation Manager",
  script: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Payment - Automation Manager",
        description:
          "Complete your payment to upgrade your plan and access premium features.",
        url: "https://www.automator-hub.com/payment",
      }),
    },
  ],
});
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
  <div
    class="min-h-dvh bg-gray-100 md:p-4 flex flex-col items-center justify-center"
  >
    <div class="max-w-4xl mx-auto">
      <NuxtPage />
    </div>
  </div>
  <SpeedInsights />
  <Analytics />
</template>
