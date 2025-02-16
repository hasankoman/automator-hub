<script setup>
import { computed, onMounted } from "vue";

import { storeToRefs } from "pinia";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const { selectedRepositories, repositories, currentStep } =
  storeToRefs(githubStore);

onMounted(() => {
  if (repositories.value.length === 0) {
    githubStore.fetchRepositories();
  }
});

const filteredRepositories = computed(() =>
  headerStore.getFilteredRepositories(repositories.value)
);
</script>

<template>
  <div class="flex flex-col w-full h-full overflow-hidden">
    <div
      class="h-full grid grid-cols-1 auto-rows-min gap-5 p-5 bg-white rounded-t-2xl overflow-auto border-t-1 border-x-1 border-gray-200 shadow-inner"
    >
      <template
        v-for="repository in filteredRepositories"
        :key="repository.id || repository.fullName"
      >
        <GithubRepositoriesRepositoryListItem :repository="repository" />
      </template>
    </div>
    <div
      class="flex items-center sticky bottom-0 z-10 justify-between gap-3 border border-gray-200 bg-white px-5 py-3 mt-auto w-full rounded-b-2xl"
    >
      <Button
        label="Previous"
        @click="currentStep -= 1"
        class="px-8 mr-auto"
        outlined
        v-if="currentStep !== 1"
      />
      <Button
        label="Next"
        @click="currentStep += 1"
        class="px-8 ml-auto"
        :disabled="Object.keys(selectedRepositories).length === 0"
      />
    </div>
  </div>
</template>
