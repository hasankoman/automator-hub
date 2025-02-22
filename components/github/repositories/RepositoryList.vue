<script setup>
import { computed, onMounted } from "vue";

import { storeToRefs } from "pinia";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const { selectedRepositories, repositories, currentStep } =
  storeToRefs(githubStore);

onMounted(() => {
  githubStore.fetchRepositories();
});

const filteredRepositories = computed(() =>
  headerStore.getFilteredRepositories(repositories.value)
);
</script>

<template>
  <div
    class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200"
  >
    <div class="p-4 md:p-5 bg-white border-b border-gray-200">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">
        Select Repositories
      </h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        Choose the repositories you want to manage.
      </p>
    </div>
    <div class="flex-1 p-4 md:p-5 space-y-8 overflow-auto">
      <div class="grid grid-cols-1 auto-rows-min gap-5">
        <template
          v-for="repository in filteredRepositories"
          :key="repository.id || repository.fullName"
        >
          <GithubRepositoriesRepositoryListItem :repository="repository" />
        </template>
      </div>
    </div>
    <div class="p-4 md:p-5 bg-white border-t border-gray-200">
      <div class="flex justify-end items-center">
        <Button
          label="Next"
          @click="currentStep += 1"
          iconPos="right"
          class="!px-4"
          :disabled="Object.keys(selectedRepositories).length === 0"
        >
          <template #icon="slotProps">
            <Icon v-bind="slotProps" name="hugeicons:arrow-right-01" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
