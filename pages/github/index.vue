<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const githubStore = useGitHubStore();
const { currentStep } = storeToRefs(githubStore);
</script>

<template>
  <GithubRepositoriesRepositoryList v-if="currentStep === 1" />
  <GithubActions v-if="currentStep === 2" />
</template>
