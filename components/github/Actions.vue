<script setup>
import { ref, onMounted } from "vue";

const githubStore = useGitHubStore();
const toast = useToast();

const { selectedRepositories, currentStep } = storeToRefs(githubStore);

const selectedAction = ref("manual");
const loadingStatus = ref({});

onMounted(() => {
  Object.keys(selectedRepositories.value).forEach((repo) => {
    loadingStatus.value[repo] = "pending";
  });
});

const triggerAction = async (repository) => {
  try {
    loadingStatus.value[repository.id] = "loading";
    if (selectedAction.value === "auto") {
      await handleAutoSetup(repository);
    } else {
      await githubStore.triggerAction(selectedAction.value, repository);
      loadingStatus.value[repository.id] = "success";
      toast.add({
        severity: "success",
        summary: "Success!",
        detail: `README updated for ${repository.name}`,
        life: 3000,
      });
    }
  } catch (error) {
    loadingStatus.value[repository.id] = "error";
  }
};

const handleAutoSetup = async (repository) => {
  await githubStore.setupWebhook(repository);
  loadingStatus.value[repository.id] = "success";
  toast.add({
    severity: "success",
    summary: "Auto-Update Enabled",
    detail: `${repository.name} will now update automatically`,
    life: 3000,
  });
};

const handleStartAction = () => {
  try {
    Object.values(selectedRepositories.value).forEach(async (repo) => {
      if (loadingStatus.value[repo.id] === "success") return;
      triggerAction(repo);
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to process repositories",
      life: 3000,
    });
  }
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200"
  >
    <div class="p-5 bg-white border-b border-gray-200">
      <h2 class="text-2xl font-bold text-gray-900">Choose Update Method</h2>
      <p class="mt-2 text-gray-600">
        Select how you want to manage your repository documentation
      </p>
    </div>

    <div class="flex-1 p-5 space-y-8 overflow-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-48">
        <div
          class="relative group cursor-pointer transition-all duration-300"
          @click="selectedAction = 'manual'"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl transition-opacity"
            :class="selectedAction === 'manual' ? 'opacity-100' : 'opacity-0'"
          ></div>
          <div
            class="relative p-4 bg-white rounded-2xl border-2 transition-all duration-300 hover:shadow-lg"
            :class="
              selectedAction === 'manual'
                ? 'border-gray-800'
                : 'border-gray-200'
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
                <h3 class="text-lg font-semibold text-gray-900">
                  Manual Update
                </h3>
                <p class="mt-2 text-gray-600">
                  Update your README manually with AI-powered suggestions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative group cursor-pointer transition-all duration-300"
          @click="selectedAction = 'auto'"
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

      <div class="bg-white rounded-2xl p-5 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Selected Repositories
        </h3>
        <div class="space-y-3">
          <div
            v-for="repository in Object.values(selectedRepositories)"
            :key="repository.id"
            class="transition-all duration-200 ease-in-out"
          >
            <div
              class="relative flex items-center justify-between p-4 rounded-xl border-1"
              :class="[
                loadingStatus[repository.id] === 'pending' &&
                  'bg-white border-gray-200 hover:border-gray-300',
                loadingStatus[repository.id] === 'loading' &&
                  'bg-gray-50 border-gray-300',
                loadingStatus[repository.id] === 'success' &&
                  'bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-emerald-200',
                loadingStatus[repository.id] === 'error' &&
                  'bg-gradient-to-r from-red-50 to-red-100/50 border-red-200',
              ]"
            >
              <div class="flex items-center gap-4 w-full">
                <div class="flex-shrink-0">
                  <Icon
                    v-if="loadingStatus[repository.id] === 'loading'"
                    name="line-md:loading-loop"
                    class="text-gray-600 !w-5 !h-5"
                  />
                  <Icon
                    v-else-if="loadingStatus[repository.id] === 'pending'"
                    name="hugeicons:clock-01"
                    class="text-gray-600 !w-5 !h-5"
                  />
                  <Icon
                    v-else-if="loadingStatus[repository.id] === 'success'"
                    name="hugeicons:checkmark-circle-03"
                    class="text-emerald-500 !w-5 !h-5"
                  />
                  <Icon
                    v-else-if="loadingStatus[repository.id] === 'error'"
                    name="hugeicons:alert-01"
                    class="text-red-500 !w-5 !h-5"
                  />
                </div>

                <div class="flex flex-col min-w-0 flex-1">
                  <span class="font-medium text-gray-900 truncate">
                    {{ repository.name }}
                  </span>
                  <div
                    v-if="repository.default_branch"
                    class="inline-flex items-center mt-1"
                  >
                    <div
                      :class="[
                        'flex items-center gap-1 px-2 py-0.5 rounded text-xs backdrop-blur-sm',
                        loadingStatus[repository.id] === 'pending' &&
                          'bg-white/80 border border-gray-200',
                        loadingStatus[repository.id] === 'loading' &&
                          'bg-white/80 border border-gray-300',
                        loadingStatus[repository.id] === 'success' &&
                          'bg-white/80 border border-emerald-200',
                        loadingStatus[repository.id] === 'error' &&
                          'bg-white/80 border border-red-200',
                      ]"
                    >
                      <Icon
                        name="hugeicons:git-branch"
                        class="text-gray-500 !w-3.5 !h-3.5"
                      />
                      <span class="text-gray-600">{{
                        repository.default_branch
                      }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <Button
                    v-if="loadingStatus[repository.id] === 'error'"
                    @click="triggerAction(repository)"
                    class="!w-8 !h-8 !min-w-8 !p-0"
                    severity="danger"
                    text
                  >
                    <template #icon>
                      <Icon name="hugeicons:refresh" class="!w-4 !h-4" />
                    </template>
                  </Button>
                  <Button
                    v-else-if="loadingStatus[repository.id] === 'pending'"
                    @click="triggerAction(repository)"
                    class="!w-8 !h-8 !min-w-8 !p-0"
                    text
                  >
                    <template #icon>
                      <Icon name="hugeicons:play" class="!w-4 !h-4" />
                    </template>
                  </Button>
                  <Button
                    v-else-if="loadingStatus[repository.id] === 'success'"
                    @click="openNewTab(repository.html_url)"
                    class="!w-8 !h-8 !min-w-8 !p-0"
                    severity="success"
                    text
                  >
                    <template #icon>
                      <Icon name="hugeicons:link-square-02" class="!w-4 !h-4" />
                    </template>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="p-5 bg-white border-t border-gray-200">
      <div class="flex justify-between items-center">
        <Button label="Back" outlined @click="currentStep -= 1">
          <template #icon>
            <Icon name="hugeicons:arrow-left-01" />
          </template>
        </Button>
        <Button
          label="Start for All"
          :disabled="Object.keys(selectedRepositories).length === 0"
          @click="handleStartAction"
        >
          <template #icon>
            <Icon name="hugeicons:rocket-01" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
