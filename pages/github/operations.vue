<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const readmeOperationsStore = useReadmeOperationsStore();
const githubStore = useGitHubStore();
const { operations } = storeToRefs(readmeOperationsStore);

onMounted(async () => {
  await readmeOperationsStore.fetchOperations();
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
    operations.value = operations.value.map((op) =>
      op.id === operation.id ? { ...op, status: "pending" } : op
    );
    await githubStore.triggerAction(
      operation.operationType,
      operation.repository
    );
    operations.value = operations.value.map((op) =>
      op.id === operation.id ? { ...op, status: "success" } : op
    );
    toast.add({
      severity: "success",
      summary: "Success!",
      detail: `README updated for ${operation.repositoryName}`,
      life: 3000,
    });
  } catch (error) {
    operations.value = operations.value.map((op) =>
      op.id === operation.id ? { ...op, status: "failed" } : op
    );
  }
};
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div
      class="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200/50 shadow-sm"
    >
      <div class="p-6 bg-white border-b border-gray-100">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2
              class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            >
              README Operations
            </h2>
            <p class="mt-1 text-gray-500">
              View and manage your README update operations
            </p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6">
        <div
          v-if="operations.length === 0"
          class="flex flex-col items-center justify-center py-12 px-4"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"
          >
            <Icon name="hugeicons:book-open" class="text-4xl text-gray-400" />
          </div>
          <p class="text-gray-500 text-center">No operations found</p>
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="operation in operations"
            :key="operation.id"
            class="group bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-500"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"
                >
                  <Icon
                    :name="getStatusIcon(operation.status)"
                    :class="['text-2xl', getStatusClass(operation.status)]"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <h3 class="font-medium text-gray-900">
                    {{ operation.repositoryName }}
                  </h3>
                  <div class="flex items-center gap-2">
                    <Badge
                      :severity="operation.status"
                      :value="operation.status"
                      :pt="{
                        root: '!rounded-lg px-3 py-1.5 !min-w-auto',
                      }"
                    />
                    <span class="text-sm text-gray-500">
                      {{
                        operation.operationType === "manual" ? "Manual" : "Auto"
                      }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDate(operation.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button
                  v-if="operation.status === 'failed'"
                  icon="hugeicons:refresh"
                  @click="handleRefresh(operation)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
