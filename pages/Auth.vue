<script setup>
useHead({
  title: "Sign In",
  meta: [
    {
      name: "description",
      content:
        "Sign in to your account using GitHub to access your documentation management features.",
    },
    {
      property: "og:title",
      content: "Sign In - Automate Your GitHub Documentation",
    },
    {
      property: "og:description",
      content:
        "Sign in to your account using GitHub to access your documentation management features.",
    },
    {
      property: "og:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
    { property: "og:url", content: "https://www.automator-hub.com/auth" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Sign In - Automate Your GitHub Documentation",
    },
    {
      name: "twitter:description",
      content:
        "Sign in to your account using GitHub to access your documentation management features.",
    },
    {
      name: "twitter:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
  ],
});

definePageMeta({
  layout: "auth",
  middleware: "auth",
  isAuthPage: true,
});

const loadingStore = useLoadingStore();
const meStore = useMeStore();

const handleSignIn = async () => {
  try {
    loadingStore.startLoading();
    await meStore.signIn();
  } catch (error) {
    loadingStore.setError(error.message || "An unexpected error occurred");
  } finally {
    loadingStore.stopLoading();
  }
};
</script>
<template>
  <div
    class="bg-white rounded-2xl p-4 flex flex-col gap-3 items-center justify-center w-11/12 md:w-1/3 xl:w-1/4 text-center"
  >
    <div class="bg-white border-b border-gray-200 pb-3">
      <h2 class="text-2xl font-bold text-gray-900">Sign In</h2>
      <p class="mt-2 text-gray-600">
        Currently, you can only sign in with your GitHub account.
      </p>
    </div>
    <Button
      label="Sign In with Github"
      class="shadow-sm rounded-xl w-full p-2 gap-2 flex items-center border-1 border-gray-200 cursor-pointer flex-1"
      @click="handleSignIn"
    >
      <template #icon>
        <Icon name="hugeicons:github" />
      </template>
    </Button>
  </div>
</template>

<style></style>
