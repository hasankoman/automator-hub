<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToPricing = () => {
  router.push("/pricing");
};
</script>

<template>
  <div
    class="border-1 border-gray-200 shadow-md rounded-xl p-4 flex flex-col gap-4"
  >
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-semibold">Subscription</h2>
      <span class="text-gray-500">You are on Free plan.</span>
    </div>
    <Button
      label="UPGRADE TO STARTER"
      class="text-sm"
      @click="navigateToPricing"
    />
  </div>
</template>
