<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const meStore = useMeStore();

const { subscription } = storeToRefs(meStore);

const settingsHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  await nextTick();
  if (settingsHeader.value) {
    headerHeight.value = settingsHeader.value.offsetHeight + 30;
  }
});
</script>

<template>
  <div
    class="flex flex-col h-full bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="settingsHeader"
    >
      <h2 class="font-bold text-gray-900">Settings</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        Manage your account, usage and subscription settings here.
      </p>
    </div>

    <div
      class="flex-1 p-5 pt-30 gap-8 overflow-auto"
      :style="{ paddingTop: `${headerHeight}px` }"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <SettingsProfile />
        <div class="flex flex-col gap-6">
          <SettingsSubscription />
          <SettingsUsage v-if="subscription" />
        </div>
      </div>
    </div>
  </div>
</template>
