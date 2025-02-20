<script setup>
const meStore = useMeStore();

const { usage } = storeToRefs(meStore);

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

onMounted(async () => {
  await meStore.fetchUsage();
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
          <span v-if="false">
            {{ value.used }}/{{ value.limit === 999999999 ? "∞" : value.limit }}
          </span>
        </div>
        <ProgressBar
          :value="
            value.limit === 999999999 ? 100 : (value.used / value.limit) * 100
          "
          :pt="{
            root: '!h-4',
            label: '!text-xs',
            value: {
              class: [
                (value.used / value.limit) * 100 >= 90
                  ? '!bg-red-600'
                  : (value.used / value.limit) * 100 >= 75
                  ? '!bg-yellow-500'
                  : '!bg-green-600',
              ],
            },
          }"
        >
          <span
            >{{ value.used }}/{{
              value.limit === 999999999 ? "∞" : value.limit
            }}</span
          >
        </ProgressBar>

        <p class="text-sm text-gray-400">
          You've used {{ value.used }} updates
          {{
            value.limit === 999999999
              ? "(unlimited quota)"
              : `out of your ${value.limit} ${formatKey(
                  key
                ).toLowerCase()} update quota`
          }}.
        </p>
      </div>
    </div>
  </div>
</template>
