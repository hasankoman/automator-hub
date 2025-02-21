<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const githubStore = useGitHubStore();
const { repositories } = storeToRefs(githubStore);
const hooks = ref([]);
const selectedRepository = ref(null);

onMounted(async () => {
  if (repositories.value.length === 0) {
    await githubStore.fetchRepositories();
  }
});

const fetchHooks = async () => {
  if (!selectedRepository.value) return;

  try {
    const response = await githubStore.fetchRepositoryHooks(
      selectedRepository.value
    );

    hooks.value = response || [];
  } catch (error) {
    console.error("Failed to fetch hooks:", error);
    hooks.value = [];
  }
};

watch(selectedRepository, fetchHooks);
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <div
      class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200"
    >
      <div class="p-5 bg-white border-b border-gray-200">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900">
          Repository Webhooks
        </h2>
        <p class="mt-2 text-gray-600">
          View and manage webhooks for your repositories
        </p>
      </div>

      <div class="flex-1 p-5 space-y-8">
        <div class="w-full md:w-1/3">
          <Dropdown
            v-model="selectedRepository"
            :options="repositories"
            optionLabel="fullName"
            placeholder="Select a repository"
            class="w-full"
          />
        </div>

        <div v-if="selectedRepository" class="space-y-4">
          <div v-if="hooks.length === 0" class="text-center py-8 text-gray-500">
            No webhooks found for this repository
          </div>

          <div
            v-else
            v-for="hook in hooks"
            :key="hook.id"
            class="bg-white p-4 rounded-xl border border-gray-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"
                >
                  <Icon name="hugeicons:webhook" class="text-xl" />
                </div>
                <div>
                  <h3 class="font-medium">{{ hook.name }}</h3>
                  <p class="text-sm text-gray-500">{{ hook.config.url }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Badge
                  :severity="hook.active ? 'success' : 'danger'"
                  :value="hook.active ? 'Active' : 'Inactive'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
