<script setup>
import { ref, onMounted } from "vue";
import { useGitHubStore } from "~/store/github";
import { openNewTab } from "~/utils/openNewTab";

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
    await githubStore.triggerAction(selectedAction.value, repository);
    loadingStatus.value[repository.id] = "success";
    toast.add({
      severity: "success",
      summary: "Process Successful",
      detail: `Readme File Updated Successfully for ${repository.name}`,
      life: 3000,
    });
  } catch (err) {
    loadingStatus.value[repository.id] = "error";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: `An unexpected error occurred for ${repository.name}`,
      life: 3000,
    });
  }
};

const handleStartAction = () => {
  try {
    Object.values(selectedRepositories.value).map(async (repo) => {
      if (loadingStatus.value[repo.id] === "success") return;
      triggerAction(repo);
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "An unexpected error occurred",
      life: 3000,
    });
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 overflow-hidden flex-1">
    <div
      class="flex flex-col gap-3 flex-1 p-5 bg-white rounded-t-2xl overflow-auto border-t-1 border-x-1 border-gray-200 shadow-inner"
    >
      <h2 class="text-2xl font-semibold text-gray-900">Select an Action</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-xl shadow-md p-6 border-2 cursor-pointer transition-all flex gap-3 justify-between"
          :class="
            selectedAction === 'manual' ? 'border-black' : 'border-gray-300'
          "
          @click="selectedAction = 'manual'"
        >
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold text-gray-900">
              Manual AI-powered README Update
            </h3>
            <p class="text-gray-600">
              Manually update your GitHub repository README with a single click.
            </p>
          </div>
          <Icon name="uil:github" class="text-4xl text-gray-700 self-end" />
        </div>

        <div
          class="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl border-2 shadow-lg p-6 transition-all relative overflow-hidden flex gap-3 justify-between"
          :class="
            selectedAction === 'auto' ? 'border-emerald-500' : 'border-gray-300'
          "
        >
          <div
            class="absolute top-0 right-0 bg-black shadow-sm shadow-black text-white text-xs font-bold px-2 py-1 rounded-bl-lg"
          >
            COMING SOON
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-xl font-bold text-white">Auto README Update</h3>
            <p class="text-white opacity-80">
              Automatically update your README when changes are detected in your
              repository.
            </p>
          </div>
          <Icon
            name="hugeicons:robotic"
            class="text-4xl text-white opacity-90 self-end"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 gap-6">
        <div class="flex justify-between items-center h-10">
          <h2 class="text-2xl font-semibold text-gray-900">Action Statuses</h2>
          <Button
            @click="handleStartAction"
            label="Start All"
            class="!text-sm h-full"
            v-if="
              Object.values(loadingStatus).some(
                (status) => status === 'error' || status === 'pending'
              )
            "
          >
            <template #icon>
              <Icon name="hugeicons:play-circle" class="text-lg" />
            </template>
          </Button>
        </div>
        <div
          class="border-1 rounded-xl h-20 w-full p-4 flex items-center justify-between shadow-md"
          v-for="repo in Object.values(selectedRepositories)"
          :key="repo.id"
          :class="[
            'relative flex items-center justify-between p-3 rounded-xl',
            loadingStatus[repo.id] === 'pending' &&
              'bg-white border border-gray-300 shadow',
            loadingStatus[repo.id] === 'loading' &&
              'bg-gray-50 border border-gray-400 shadow-inner',
            loadingStatus[repo.id] === 'success' &&
              'bg-gradient-to-r from-green-100 to-green-50 border border-green-400 shadow-lg',
            loadingStatus[repo.id] === 'error' &&
              'bg-gradient-to-r from-red-100 to-red-50 border border-red-400 shadow-lg',
          ]"
        >
          <div class="flex items-center justify-between gap-4 w-full">
            <div class="flex gap-3 items-center">
              <Icon
                v-if="loadingStatus[repo.id] === 'loading'"
                name="line-md:loading-loop"
                class="text-black !w-6 !h-6"
              />
              <Icon
                v-else-if="loadingStatus[repo.id] === 'pending'"
                name="hugeicons:clock-01"
                class="text-black !w-6 !h-6"
              />
              <Icon
                v-else-if="loadingStatus[repo.id] === 'success'"
                name="hugeicons:checkmark-circle-03"
                class="text-green-500 !w-6 !h-6"
              />
              <Icon
                v-else-if="loadingStatus[repo.id] === 'error'"
                name="hugeicons:alert-01"
                class="text-red-500 !w-6 !h-6"
              />
              <div class="flex flex-col items-start gap-1">
                <span>{{ repo.name }}</span>
                <div
                  v-if="repo.default_branch"
                  :class="[
                    'flex items-center gap-1 bg-[#ffffff9a] px-2 py-1 rounded text-xs',
                    loadingStatus[repo.id] === 'pending' &&
                      ' border border-gray-300 ',
                    loadingStatus[repo.id] === 'loading' &&
                      ' border border-gray-400',
                    loadingStatus[repo.id] === 'success' &&
                      ' border border-green-400 ',
                    loadingStatus[repo.id] === 'error' &&
                      ' border border-red-400 ',
                  ]"
                >
                  <Icon name="hugeicons:git-branch" class="" />
                  {{ repo.default_branch }}
                </div>
              </div>
            </div>
            <Button
              v-if="loadingStatus[repo.id] === 'error'"
              @click="triggerAction(repo)"
              class="!w-10 !h-10"
            >
              <template #icon>
                <Icon name="hugeicons:refresh" />
              </template>
            </Button>
            <Button
              v-else-if="loadingStatus[repo.id] === 'pending'"
              @click="triggerAction(repo)"
              class="!w-10 !h-10"
            >
              <template #icon>
                <Icon name="hugeicons:play" />
              </template>
            </Button>
            <Button
              v-else-if="loadingStatus[repo.id] === 'success'"
              class="!w-10 !h-10"
              @click="openNewTab(repo.html_url)"
            >
              <template #icon>
                <Icon name="hugeicons:link-square-02" />
              </template>
            </Button>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>
