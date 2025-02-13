<script setup>
const props = defineProps({
  premiumRequests: {
    type: Number,
    default: 0,
  },
  premiumLimit: {
    type: Number,
    default: 50,
  },
  monthlyRequests: {
    type: Number,
    default: 0,
  },
  monthlyLimit: {
    type: Number,
    default: 200,
  },
});
</script>

<template>
  <div class="bg-[#1A1A1A] rounded-xl p-6">
    <h2 class="text-xl font-semibold text-white mb-4">Usage</h2>
    <div class="bg-black rounded-lg p-4">
      <h3 class="text-white mb-2">Usage (Last 30 days)</h3>
      <div class="space-y-6">
        <div>
          <div class="flex justify-between text-white mb-2">
            <span>Premium models</span>
            <span
              >{{ premiumRequests }} / {{ premiumLimit }} gpt-4o-mini or
              cursor-small</span
            >
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-green-500 h-2 rounded-full"
              :style="`width: ${(premiumRequests / premiumLimit) * 100}%`"
            ></div>
          </div>
          <p class="text-gray-400 text-sm mt-2">
            You've used {{ premiumRequests }} requests out of your
            {{ premiumLimit }} fast requests quota.
          </p>
        </div>

        <div>
          <div class="flex justify-between text-white mb-2">
            <span>Monthly Usage</span>
            <span>{{ monthlyRequests }} / {{ monthlyLimit }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div
              class="bg-green-500 h-2 rounded-full"
              :style="`width: ${(monthlyRequests / monthlyLimit) * 100}%`"
            ></div>
          </div>
          <p class="text-gray-400 text-sm mt-2">
            You've used {{ monthlyRequests }} requests out of your
            {{ monthlyLimit }} monthly fast requests quota.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
