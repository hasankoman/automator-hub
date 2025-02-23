<script setup>
const meStore = useMeStore();
const githubStore = useGitHubStore();
const router = useRouter();

const { subscription, usage } = storeToRefs(meStore);
const { selectedAction } = storeToRefs(githubStore);

const upgradeDialog = ref({
  active: false,
  type: null,
  title: "",
  message: "",
});

onMounted(async () => {
  await meStore.fetchSubscription();
  await meStore.fetchUsage();
});

const handleSelection = async (selection) => {
  if (selection === "auto") {
    if (subscription.value.plan.allowAutoReadme) {
      selectedAction.value = "auto";
    } else {
      upgradeDialog.value = {
        active: true,
        type: "auto",
        title: "Upgrade Required",
        message:
          "Auto-update feature is only available with our Pro plan. Upgrade now to enable automatic README updates.",
      };
    }
  } else if (selection === "manual") {
    if (usage.value["manualReadme"].used >= usage.value["manualReadme"].limit) {
      upgradeDialog.value = {
        active: true,
        type: "manual",
        title: "Upgrade Required",
        message: `You've reached your manual update limit of ${usage.value["manualReadme"].limit} updates. Please consider upgrading your plan to continue using the manual update feature without restrictions.`,
      };
    } else {
      selectedAction.value = "manual";
    }
  }
};

const navigateToPricing = () => {
  upgradeDialog.value = {
    active: false,
    type: null,
    title: "",
    message: "",
  };
  router.push("/pricing");
};
</script>

<template>
  <div class="flex-1 p-5 space-y-8 overflow-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-48">
      <div
        class="relative group cursor-pointer transition-all duration-300"
        @click="handleSelection('manual')"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl transition-opacity"
          :class="selectedAction === 'manual' ? 'opacity-100' : 'opacity-0'"
        ></div>
        <div
          class="relative p-4 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
          :class="
            selectedAction === 'manual' ? 'border-gray-800' : 'border-gray-200'
          "
        >
          <div class="flex items-start space-x-4">
            <div
              class="p-3 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <Icon
                name="hugeicons:ai-brain-03"
                class="text-2xl text-gray-900"
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">
                  Manual Update
                </h3>
                <span
                  v-if="usage['manualReadme']"
                  class="text-sm text-gray-500"
                >
                  {{ usage["manualReadme"].used }}/{{
                    usage["manualReadme"].limit === 999999999
                      ? "∞"
                      : usage["manualReadme"].limit
                  }}
                </span>
              </div>
              <p class="mt-2 text-gray-600">
                Update your README manually with AI-powered suggestions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="relative group cursor-pointer transition-all duration-300"
        @click="handleSelection('auto')"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl transition-opacity"
          :class="selectedAction === 'auto' ? 'opacity-100' : 'opacity-0'"
        ></div>
        <div
          class="relative p-4 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
          :class="
            selectedAction === 'auto' ? 'border-gray-800' : 'border-gray-200'
          "
        >
          <div class="flex items-start space-x-4">
            <div
              class="p-3 bg-gray-100 rounded-lg flex items-center justify-center"
            >
              <Icon
                name="fluent:bot-sparkle-48-regular"
                class="text-2xl text-gray-900"
              />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">Auto Update</h3>
              <p class="mt-2 text-gray-600">
                Keep your README in sync automatically with repository changes
              </p>
              <span
                class="absolute left-[50%] translate-x-[-50%] top-0 translate-y-[-50%] inline-flex items-center px-5 py-1 rounded-xl text-sm font-medium bg-gray-900 text-white"
              >
                Pro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog
    v-model:visible="upgradeDialog.active"
    modal
    :showHeader="false"
    :pt="{
      root: 'rounded-2xl mx-4 !w-full md:!w-1/3',
      content: 'rounded-2xl !p-6',
    }"
  >
    <div class="flex flex-col items-center gap-4">
      <div
        class="p-4 bg-gray-100 rounded-full flex items-center justify-center"
      >
        <Icon
          name="fluent:premium-person-16-regular"
          class="text-4xl text-gray-900"
        />
      </div>
      <h2 class="text-xl font-bold text-center">{{ upgradeDialog.title }}</h2>
      <p class="text-gray-600 text-center">
        {{ upgradeDialog.message }}
      </p>
      <div class="flex gap-2 w-full">
        <Button
          label="Cancel"
          class="w-full"
          @click="upgradeDialog.active = false"
          outlined
        />
        <Button label="View Plans" class="w-full" @click="navigateToPricing" />
      </div>
    </div>
  </Dialog>
</template>
