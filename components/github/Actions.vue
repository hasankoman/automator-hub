<script setup>
import { ref, onMounted } from "vue";

const githubStore = useGitHubStore();
const readmeOperationsStore = useReadmeOperationsStore();
const toast = useToast();

const { selectedRepositories, currentStep, selectedAction } =
  storeToRefs(githubStore);

const loadingStatus = ref({});

onMounted(() => {
  Object.keys(selectedRepositories.value).forEach((repo) => {
    loadingStatus.value[repo] = "pending";
  });
});

const triggerAction = async (repository) => {
  try {
    if (
      loadingStatus.value[repository.id] === "error" ||
      loadingStatus.value[repository.id] === "pending"
    ) {
      loadingStatus.value[repository.id] = "loading";

      await readmeOperationsStore.createOrUpdateOperation({
        repositoryId: repository.id,
        repositoryName: repository.name,
        operationType: selectedAction.value,
        status: "pending",
      });

      if (selectedAction.value === "auto") {
        await handleAutoSetup(repository);
      } else {
        await githubStore.triggerAction(selectedAction.value, repository);
        loadingStatus.value[repository.id] = "success";

        await readmeOperationsStore.createOrUpdateOperation({
          repositoryId: repository.id,
          repositoryName: repository.name,
          operationType: selectedAction.value,
          status: "success",
        });

        toast.add({
          severity: "success",
          summary: "Success!",
          detail: `README updated for ${repository.name}`,
          life: 3000,
        });
      }
    } else if (loadingStatus.value[repository.id] === "success") {
      openNewTab(repository.html_url);
    }
  } catch (error) {
    loadingStatus.value[repository.id] = "error";

    // İşlem başarısız olduğunda güncelle
    await readmeOperationsStore.createOrUpdateOperation({
      repositoryId: repository.id,
      repositoryName: repository.name,
      operationType: selectedAction.value,
      status: "failed",
    });
  }
};

const handleAutoSetup = async (repository) => {
  try {
    await githubStore.setupWebhook(repository);
    loadingStatus.value[repository.id] = "success";

    // İşlem başarılı olduğunda güncelle
    await readmeOperationsStore.createOrUpdateOperation({
      repositoryId: repository.id,
      repositoryName: repository.name,
      operationType: "auto",
      status: "success",
    });

    toast.add({
      severity: "success",
      summary: "Auto-Update Enabled",
      detail: `${repository.name} will now update automatically`,
      life: 3000,
    });
  } catch (error) {
    loadingStatus.value[repository.id] = "error";

    // İşlem başarısız olduğunda güncelle
    await readmeOperationsStore.createOrUpdateOperation({
      repositoryId: repository.id,
      repositoryName: repository.name,
      operationType: "auto",
      status: "failed",
    });

    toast.add({
      severity: "error",
      summary: "Error",
      detail: `Failed to setup auto-update for ${repository.name}`,
      life: 3000,
    });
  }
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
  <div class="flex-1 p-5 gap-8 overflow-auto">
    <div class="bg-white rounded-2xl p-5 border border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">
        Selected Repositories
      </h3>
      <div class="flex flex-col gap-3">
        <div
          v-for="repository in Object.values(selectedRepositories)"
          :key="repository.id"
          class="transition-all duration-200 ease-in-out cursor-pointer"
          @click="triggerAction(repository)"
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

              <div class="flex items-center justify-center">
                <Icon
                  v-if="loadingStatus[repository.id] === 'error'"
                  name="hugeicons:refresh"
                  class="!w-4 !h-4 text-red-500"
                />
                <Icon
                  v-else-if="loadingStatus[repository.id] === 'pending'"
                  name="hugeicons:play"
                  class="!w-4 !h-4"
                />
                <Icon
                  v-else-if="loadingStatus[repository.id] === 'success'"
                  name="hugeicons:link-square-02"
                  class="!w-4 !h-4"
                />
              </div>
            </div>
          </div>
        </div>
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
