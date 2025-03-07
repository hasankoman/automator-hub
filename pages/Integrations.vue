<script setup>
useHead({
  title: "Integrations",
  meta: [
    {
      name: "description",
      content:
        "Connect your GitHub account with public or private repositories to automate documentation management.",
    },
    {
      property: "og:title",
      content: "Integrations - Automate Your GitHub Documentation",
    },
    {
      property: "og:description",
      content:
        "Connect your GitHub account with public or private repositories to automate documentation management.",
    },
    {
      property: "og:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
    {
      property: "og:url",
      content: "https://www.automator-hub.com/integrations",
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Integrations - Automate Your GitHub Documentation",
    },
    {
      name: "twitter:description",
      content:
        "Connect your GitHub account with public or private repositories to automate documentation management.",
    },
    {
      name: "twitter:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
  ],
});

import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const { signIn, signOut, data } = useAuth();
const router = useRouter();
const toast = useToast();
const loadingStore = useLoadingStore();

const isPrivateRepoAccess = ref(false);
const integrationsHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  await nextTick();
  if (integrationsHeader.value) {
    headerHeight.value = integrationsHeader.value.offsetHeight + 30;
  }
});

const handleGithubConnect = async () => {
  try {
    loadingStore.startLoading();
    const response = await signIn("github", {
      scope: isPrivateRepoAccess.value
        ? "read:user repo admin:repo_hook"
        : "read:user public_repo admin:repo_hook",
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
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="integrationsHeader"
    >
      <h2 class="font-bold text-gray-900">Integrations</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        Connect your GitHub account with either public or private repository
      </p>
    </div>

    <div
      class="flex-1 pb-5 px-3 md:px-5 gap-8 overflow-x-hidden overflow-y-auto flex items-center justify-center shadow-inner"
      :style="{ paddingTop: `${headerHeight}px` }"
    >
      <template v-if="data">
        <div
          class="p-4 bg-white rounded-xl shadow-xs flex flex-col gap-3 col-span-1 border border-gray-200 w-full"
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
          class="p-4 bg-white rounded-xl shadow-xs flex flex-col items-center justify-between gap-1 col-span-1 border border-gray-200 w-full"
        >
          <Icon name="mdi:account-lock" class="text-5xl text-black mb-2" />
          <p class="text-lg font-semibold text-gray-700 text-center">
            Login Required
          </p>
          <p class="text-sm text-gray-500 m-0 text-center">
            Please sign in to your account to continue.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
