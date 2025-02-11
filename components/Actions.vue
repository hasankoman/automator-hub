<script setup>
import { ref } from "vue";
import { useGitHubStore } from "~/store/github";
import { useLoadingStore } from "~/store/loading";

const githubStore = useGitHubStore();
const loadingStore = useLoadingStore();
const toast = useToast();

const { selectedRepositories, currentStep } = storeToRefs(githubStore);

const selectedAction = ref(null);

const handleTriggerAction = async () => {
  try {
    loadingStore.startLoading();
    await githubStore.triggerAction(selectedAction.value);
    toast.add({
      severity: "success",
      summary: "Process Successful",
      detail: "Readme File Updated Successfully",
      life: 3000,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    loadingStore.stopLoading();
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 overflow-hidden flex-1">
    <Header />
    <div
      class="flex flex-col gap-3 flex-1 p-5 bg-white rounded-t-2xl overflow-auto border-t-1 border-x-1 border-gray-200 shadow-inner"
    >
      <div class="flex flex-col gap-4">
        <h2 class="text-2xl font-semibold text-gray-900">
          Selected Repositories
        </h2>
        <div class="flex gap-2 flex-wrap">
          <Chip
            v-for="repo in Object.values(selectedRepositories)"
            :key="repo.name"
            :label="repo.name"
            class="text-sm px-3 py-1 rounded-full border border-gray-700 text-gray-900 bg-gray-200 hover:bg-gray-300 transition"
          />
        </div>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900">Select an Action</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-xl shadow-md p-6 border-2 cursor-pointer hover:shadow-lg transition-all"
          :class="
            selectedAction === 'manual' ? 'border-black' : 'border-gray-300'
          "
          @click="selectedAction = 'manual'"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-bold text-gray-900">
              Manual README Update
            </h3>
            <Icon name="uil:github" class="text-4xl text-gray-700" />
          </div>
          <p class="text-gray-600">
            Manually update your GitHub repository README with a single click.
          </p>
        </div>

        <div
          class="bg-gradient-to-r from-gray-900 to-gray-700 rounded-xl border-2 shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl relative overflow-hidden"
          :class="
            selectedAction === 'auto' ? 'border-emerald-500' : 'border-gray-300'
          "
          @click="selectedAction = 'auto'"
        >
          <div
            class="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg"
          >
            PREMIUM
          </div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xl font-bold text-white">Auto README Update</h3>
            <Icon
              name="hugeicons:robotic"
              class="text-4xl text-white opacity-90"
            />
          </div>
          <p class="text-white opacity-80">
            Automatically update your README when changes are detected in your
            repository.
          </p>
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
    <Button
      label="Start Action"
      @click="handleTriggerAction"
      class="px-8 ml-auto"
      :disabled="Object.keys(selectedRepositories).length === 0"
    />
  </div>
</template>
