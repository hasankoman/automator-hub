<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const readmeHistoryStore = useReadmeHistoryStore();
const { history } = storeToRefs(readmeHistoryStore);

const historyHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  await readmeHistoryStore.fetchHistory();

  await nextTick();
  if (historyHeader.value) {
    headerHeight.value = historyHeader.value.offsetHeight + 30;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="historyHeader"
    >
      <h2 class="font-bold text-gray-900">README History</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        View and manage your README update history
      </p>
    </div>

    <div
      class="flex-1 pb-5 px-3 md:px-5 gap-8 shadow-inner overflow-auto"
      :style="{ paddingTop: `${headerHeight}px` }"
      v-if="history"
    >
      <div
        class="p-4 bg-white rounded-xl shadow-xs flex flex-col items-center justify-between gap-1 col-span-1 border border-gray-200"
        v-if="history.length === 0"
      >
        <Icon
          name="fluent:history-48-regular"
          class="text-5xl text-black mb-2"
        />
        <p class="text-lg font-semibold text-gray-700">No history found</p>
        <p class="text-sm text-gray-500 m-0">
          You have not performed any operations yet.
        </p>
      </div>
      <div class="grid grid-cols-1 auto-rows-min gap-5" v-else>
        <div
          v-for="h in history"
          :key="h.id"
          class="flex items-center justify-between gap-4 bg-white rounded-xl shadow-xs p-4 border border-gray-200"
        >
          <div class="flex flex-col gap-1 w-full">
            <div class="flex justify-between items-center gap-2">
              <h3 class="font-medium text-gray-900">
                {{ h.repositoryName }}
              </h3>
              <Badge
                :severity="h.status"
                :value="h.status"
                :pt="{
                  root: '!rounded-lg px-3 py-1.5 !min-w-auto',
                }"
              />
            </div>
            <span class="text-sm text-gray-500">
              {{ h.operationType === "manual" ? "Manual" : "Auto" }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDate(h.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
