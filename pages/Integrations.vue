<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

import Checkbox from "primevue/checkbox";

const { signIn, signOut, data } = useAuth();
const router = useRouter();
const toast = useToast();
const loadingStore = useLoadingStore();

const isPrivateRepoAccess = ref(false);

const handleGithubConnect = async () => {
  try {
    loadingStore.startLoading();
    const response = await signIn("github", {
      scope: isPrivateRepoAccess.value
        ? "read:user repo"
        : "read:user public_repo",
    });

    if (response?.error) {
      throw new Error(response.error);
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Successfully connected to Github account",
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error instanceof Error ? error.message : "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    loadingStore.stopLoading();
  }
};

const handleGithubDisconnect = async () => {
  try {
    loadingStore.startLoading();
    const response = await signOut("github", { redirect: false });

    if (response?.error) {
      throw new Error(response.error);
    }

    toast.add({
      severity: "success",
      summary: "Success",
      detail: "Successfully disconnected from Github account",
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail:
        error instanceof Error ? error.message : "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    loadingStore.stopLoading();
  }
};

const navigateToLogin = () => {
  router.push("/account");
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full">
    <div
      class="flex flex-col gap-5 p-5 bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl m-0 font-bold">GitHub Integration</h2>
        <span class="text-gray-500">
          Connect your GitHub account with either public or private repository
          access and manage your authentication preferences effortlessly.
        </span>
      </div>

      <template v-if="data">
        <div
          class="p-4 bg-white rounded-xl shadow-xs flex flex-col gap-3 col-span-1 border border-gray-200"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="flex gap-3 items-center">
              <div
                class="border border-gray-100 rounded-lg w-10 h-10 flex items-center justify-center shadow-inner"
              >
                <Icon name="mdi:github" class="text-3xl" />
              </div>
              <div class="flex flex-col">
                <span>Github</span>
                <span v-if="data.user.github" class="text-sm text-gray-400">
                  {{ data.user.github.username }}
                </span>
              </div>
            </div>

            <template v-if="false">
              <Button
                label="Disconnect"
                outlined
                v-if="data?.user.github"
                @click="handleGithubDisconnect"
              />
              <Button label="Connect" v-else @click="handleGithubConnect" />
            </template>
          </div>
          <div
            class="flex items-center gap-2 pt-3 border-t-1 border-gray-200"
            v-if="!data?.user.github && false"
          >
            <Checkbox
              inputId="privateRepoAccess"
              v-model="isPrivateRepoAccess"
              :pt="{
                box: '!rounded-lg',
              }"
              :value="true"
            />
            <label for="privateRepoAccess" class="text-sm text-gray-600">
              Access my private repositories
            </label>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="p-4 bg-white rounded-xl shadow-xs flex flex-col items-center justify-between gap-1 col-span-1 border border-gray-200"
        >
          <Icon name="mdi:account-lock" class="text-5xl text-black mb-2" />
          <p class="text-lg font-semibold text-gray-700">Login Required</p>
          <p class="text-sm text-gray-500 m-0">
            Please sign in to your account to continue.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
