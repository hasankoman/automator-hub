<script setup>
import { computed, onMounted } from "vue";

import { storeToRefs } from "pinia";

const githubStore = useGitHubStore();
const headerStore = useHeaderStore();
const { selectedRepositories, repositories, currentStep, selectedAction } =
  storeToRefs(githubStore);

onMounted(() => {
  githubStore.fetchRepositories();
});

const filteredRepositories = computed(() =>
  headerStore.getFilteredRepositories(repositories.value)
);
</script>

<template>
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
</template>
