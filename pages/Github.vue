<script setup>
import { useGitHubStore } from "~/store/github";

const githubStore = useGitHubStore();
const { currentStep } = storeToRefs(githubStore);
</script>

<template>
  <repositories-repository-list v-if="currentStep === 1" />
  <Actions v-if="currentStep === 2" />
</template>
