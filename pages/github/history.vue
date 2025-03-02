<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const readmeHistoryStore = useReadmeHistoryStore();
const githubStore = useGitHubStore();
const { history } = storeToRefs(readmeHistoryStore);

onMounted(async () => {
  await readmeHistoryStore.fetchHistory();
});

const getStatusIcon = (status) => {
  switch (status) {
    case "success":
      return "hugeicons:check-circle";
    case "failed":
      return "hugeicons:close-circle";
    case "pending":
      return "hugeicons:clock-circle";
    default:
      return "hugeicons:info-circle";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "success":
      return "text-green-500";
    case "failed":
      return "text-red-500";
    case "pending":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const handleRefresh = async (operation) => {
  try {
    history.value = history.value.map((history) =>
      history.id === history.id ? { ...history, status: "pending" } : history
    );
    await githubStore.triggerAction(
      operation.operationType,
      operation.repository
    );
    history.value = history.value.map((history) =>
      history.id === history.id ? { ...history, status: "success" } : history
    );
    toast.add({
      severity: "success",
      summary: "Success!",
      detail: `README updated for ${history.repositoryName}`,
      life: 3000,
    });
  } catch (error) {
    history.value = history.value.map((history) =>
      history.id === history.id ? { ...history, status: "failed" } : history
    );
  }
};
</script>

<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="block p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 w-full z-10 transition-all duration-300"
    >
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-bold">README History</h2>
        <p class="m-0 text-gray-500 text-sm">
          View and manage your README update history
        </p>
      </div>
    </div>

    <div class="flex-1 p-4 md:p-6 gap-2 !pt-32">
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
      <div v-else class="grid gap-4">
        <div
          v-for="h in history"
          :key="h.id"
          class="group bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-500"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"
              >
                <Icon
                  :name="getStatusIcon(h.status)"
                  :class="['text-2xl', getStatusClass(h.status)]"
                />
              </div>
              <div class="flex flex-col gap-1">
                <h3 class="font-medium text-gray-900">
                  {{ h.repositoryName }}
                </h3>
                <div class="flex items-center gap-2">
                  <Badge
                    :severity="h.status"
                    :value="h.status"
                    :pt="{
                      root: '!rounded-lg px-3 py-1.5 !min-w-auto',
                    }"
                  />
                  <span class="text-sm text-gray-500">
                    {{ h.operationType === "manual" ? "Manual" : "Auto" }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(h.createdAt) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Button
                v-if="h.status === 'failed'"
                icon="hugeicons:refresh"
                @click="handleRefresh(h)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
