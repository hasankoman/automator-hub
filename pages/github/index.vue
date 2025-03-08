<script setup>
import ActionSelection from "~/components/github/ActionSelection.vue";
import RepositoryList from "~/components/github/repositories/RepositoryList.vue";
import Actions from "~/components/github/Actions.vue";

definePageMeta({
  middleware: "auth",
  authRequired: false,
});

useHead({
  title: "GitHub Dashboard",
  meta: [
    {
      name: "description",
      content:
        "Manage your GitHub repositories and automate documentation updates with AI-powered features.",
    },
    {
      property: "og:title",
      content: "GitHub Dashboard - Automate Your Documentation",
    },
    {
      property: "og:description",
      content:
        "Manage your GitHub repositories and automate documentation updates with AI-powered features.",
    },
    {
      property: "og:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
    { property: "og:url", content: "https://www.automator-hub.com/github" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "GitHub Dashboard - Automate Your Documentation",
    },
    {
      name: "twitter:description",
      content:
        "Manage your GitHub repositories and automate documentation updates with AI-powered features.",
    },
    {
      name: "twitter:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
  ],
});

onBeforeMount(() => {
  githubStore.resetState();
});

const githubStore = useGitHubStore();
const { currentStep, selectedAction, selectedRepositories } =
  storeToRefs(githubStore);

const actionSelectionHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  await nextTick();
  if (actionSelectionHeader.value) {
    headerHeight.value = actionSelectionHeader.value.offsetHeight + 30;
  }
});

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
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="block p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 w-full z-10 transition-all duration-300"
      ref="actionSelectionHeader"
    >
      <div class="flex flex-col md:flex-row gap-4 justify-between">
        <div class="flex flex-row md:flex-col gap-x-1 justify-between">
          <h2 class="text-gray-900 font-bold">
            {{ stepComponents[currentStep].header.title }}
          </h2>
          <p class="mt-2 text-gray-500 text-base hidden md:block">
            {{ stepComponents[currentStep].header.description }}
          </p>
          <div class="flex md:hidden h-full gap-3 border-gray-200">
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
        <p class="mt-2 text-gray-500 text-sm block md:hidden">
          {{ stepComponents[currentStep].header.description }}
        </p>
        <div class="h-full gap-3 border-gray-200 hidden md:flex">
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
    <div
      class="flex-1 overflow-auto"
      :style="{ paddingTop: `${headerHeight}px` }"
      @scroll="handleScroll"
    >
      <component :is="stepComponents[currentStep].component" />
    </div>
  </div>
</template>

<style scoped></style>
