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
        summary: "Process Successful",
        detail: `Readme File Updated Successfully for ${repository.name}`,
        life: 3000,
      });
    }
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

const handleAutoSetup = async (repository) => {
  try {
    await githubStore.setupWebhook(repository);
    loadingStatus.value[repository.id] = "success";
    toast.add({
      severity: "success",
      summary: "Setup Successful",
      detail: `Auto-update enabled for ${repository.name}`,
      life: 3000,
    });
  } catch (err) {
    throw new Error(`Failed to setup auto-update: ${err.message}`);
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
  <div class="flex flex-col overflow-hidden flex-1">
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
          class="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl border-2 shadow-lg p-6 transition-all relative overflow-hidden flex gap-3 justify-between cursor-pointer"
          :class="
            selectedAction === 'auto' ? 'border-emerald-500' : 'border-gray-300'
          "
          @click="selectedAction = 'auto'"
        >
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

      <div class="mt-8">
        <h3 class="text-xl font-semibold mb-4">Selected Repositories</h3>
        <div class="space-y-4">
          <div
            v-for="repository in Object.values(selectedRepositories)"
            :key="repository.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
          >
            <div class="flex items-center gap-3">
              <img
                :src="repository.avatarUrl"
                :alt="repository.name"
                class="w-8 h-8 rounded-full"
              />
              <span class="font-medium">{{ repository.name }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon
                v-if="loadingStatus[repository.id] === 'success'"
                name="material-symbols:check-circle"
                class="text-2xl text-emerald-500"
              />
              <Icon
                v-if="loadingStatus[repository.id] === 'error'"
                name="material-symbols:error"
                class="text-2xl text-red-500"
              />
              <span
                v-if="loadingStatus[repository.id] === 'loading'"
                class="loading loading-spinner loading-sm"
              ></span>
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
      />
      <Button
        label="Start Process"
        @click="handleStartAction"
        class="px-8"
        :disabled="Object.keys(selectedRepositories).length === 0"
      />
    </div>
  </div>
</template>
