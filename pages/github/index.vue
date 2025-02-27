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
      buttonDisabled: {
        prev: currentStep.value === 1,
        next: !selectedAction.value,
      },
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
      buttonDisabled: {
        prev: false,
        next: Object.keys(selectedRepositories.value).length === 0,
      },
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
      buttonDisabled: {
        prev: false,
        next: true,
      },
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

const scrollPosition = ref(0);

const handleScroll = (event) => {
  const target = event.target;
  scrollPosition.value = target.scrollTop;
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200"
  >
    <div
      class="block p-5 bg-white/10 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 transition-all duration-300"
    >
      <div class="flex gap-4 justify-between">
        <div class="">
          <h2 class="font-bold text-gray-900">
            {{ stepComponents[currentStep].header.title }}
          </h2>
          <p class="mt-2 text-gray-600">
            {{ stepComponents[currentStep].header.description }}
          </p>
        </div>
        <div class="flex h-full gap-3 border-gray-200">
          <Button
            outlined
            size="small"
            class="w-10 h-10"
            :disabled="stepComponents[currentStep].buttonDisabled.prev"
            @click="currentStep -= 1"
          >
            <template #icon>
              <Icon
                name="hugeicons:arrow-left-01"
                class="!text-black"
                size="18"
              />
            </template>
          </Button>
          <Button
            iconPos="right"
            size="small"
            class="w-10 h-10"
            :disabled="stepComponents[currentStep].buttonDisabled.next"
            @click="stepComponents[currentStep].action()"
          >
            <template #icon="slotProps">
              <Icon
                v-bind="slotProps"
                class="!text-white"
                name="hugeicons:arrow-right-01"
                size="18"
              />
            </template>
          </Button>
        </div>
      </div>
    </div>
    <div class="flex-1 overflow-auto" @scroll="handleScroll">
      <component :is="stepComponents[currentStep].component" />
    </div>
  </div>
</template>

<style scoped></style>
