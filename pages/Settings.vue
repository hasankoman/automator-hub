<script setup>
import SettingsProfile from "@/components/settings/Profile.vue";

definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const meStore = useMeStore();

const { subscription } = storeToRefs(meStore);
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <div
      class="flex flex-col gap-5 p-5 bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold m-0">Settings</h1>
        <p class="text-gray-500">
          You can manage your account, usage and subscription settings here.
        </p>
      </div>

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
