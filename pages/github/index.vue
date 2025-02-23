<script setup>
import ActionSelection from "~/components/github/ActionSelection.vue";
import RepositoryList from "~/components/github/repositories/RepositoryList.vue";
import Actions from "~/components/github/Actions.vue";

definePageMeta({
  middleware: "auth",
  authRequired: true,
});

onBeforeMount(() => {
  githubStore.resetState();
});

const githubStore = useGitHubStore();
const { currentStep, selectedAction, selectedRepositories } =
  storeToRefs(githubStore);

const stepComponents = computed(() => {
  return {
    1: {
      component: ActionSelection,
      buttonDisabled: !selectedAction.value,
      action: () => {
        currentStep.value += 1;
      },
      header: {
        title: "Choose Update Method",
        description:
          "Select how you want to manage your repository documentation",
      },
    },
    2: {
      component: RepositoryList,
      buttonDisabled: Object.keys(selectedRepositories.value).length === 0,
      action: () => {
        currentStep.value += 1;
      },
      header: {
        title: `Select Repositories for ${
          selectedAction.value === "auto" ? "Automatic" : "Manual"
        } Update`,
        description: `Choose the repositories you want to manage with ${
          selectedAction.value === "auto" ? "automatic" : "manual"
        } updates.`,
      },
    },
    3: {
      component: Actions,
      action: () => {
        currentStep.value += 1;
      },
      header: {
        title: "Review and Start",
        description: `Review your selections and start the ${
          selectedAction.value === "auto" ? "automatic" : "manual"
        } update process`,
      },
    },
  };
});
</script>

<template>
  <div
    class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200"
  >
    <div class="p-4 md:p-5 bg-white border-b border-gray-200">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900">
        {{ stepComponents[currentStep].header.title }}
      </h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        {{ stepComponents[currentStep].header.description }}
      </p>
    </div>
    <component :is="stepComponents[currentStep].component" />
    <div class="p-5 bg-white border-t border-gray-200">
      <div class="flex justify-between items-center">
        <Button
          label="Back"
          outlined
          @click="currentStep -= 1"
          v-if="currentStep > 1"
        >
          <template #icon>
            <Icon name="hugeicons:arrow-left-01" />
          </template>
        </Button>
        <Button
          v-if="currentStep !== Object.keys(stepComponents).length"
          label="Next"
          iconPos="right"
          class="ml-auto !px-4"
          :disabled="stepComponents[currentStep].buttonDisabled"
          @click="stepComponents[currentStep].action()"
        >
          <template #icon="slotProps">
            <Icon v-bind="slotProps" name="hugeicons:arrow-right-01" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>
