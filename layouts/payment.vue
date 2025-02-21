<script setup>
useHead({
  title: "Payment - Automation Manager",
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
</template>
