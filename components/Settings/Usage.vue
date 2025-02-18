<script setup>
const usageStore = useMeStore();

const { usage } = storeToRefs(usageStore);

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

onMounted(async () => {
  await usageStore.fetchUsage();
});
</script>

<template>
  <div
    class="rounded-xl p-4 border border-gray-200 shadow-md flex flex-col gap-3"
  >
    <h2 class="text-xl font-semibold border-b border-gray-200 pb-2">Usage</h2>
    <div v-for="[key, value] in Object.entries(usage)">
      <div class="flex flex-col gap-2">
        <div class="flex justify-between items-center text-md">
          <h3>{{ formatKey(key) }}</h3>
          <span>{{ value.used }}/{{ value.limit }}</span>
        </div>
        <ProgressBar
          :value="(value.used / value.limit) * 100"
          :pt="{
            root: '!h-4',
            label: 'hidden',
          }"
        />

        <p class="text-sm text-gray-400">
          You've used {{ value.used }} updates out of your {{ value.limit }}
          {{ formatKey(key).toLowerCase() }} update quota.
        </p>
      </div>
    </div>
  </div>
</template>
