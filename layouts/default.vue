<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "#imports";

useHead({
  title: "Automation Manager",
});

import { Sidebar } from "#components";

const route = useRoute();

const { fetchUser, fetchSubscription } = useMeStore();

const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);

const githubStore = useGitHubStore();
const { currentStep } = storeToRefs(githubStore);

onMounted(async () => {
  await Promise.all([fetchUser(), fetchSubscription()]);
});

const handleOutClick = () => {
  if (sidebarOpen.value && window.innerWidth < 768) {
    sidebarStore.closeSidebar();
  }
};

watch(
  () => route.fullPath,
  () => {
    if (sidebarOpen.value && window.innerWidth < 768) {
      sidebarStore.closeSidebar();
    }
  }
);
</script>

<template>
  <Loading />

  <div class="min-h-dvh bg-gray-100">
    <div class="relative h-dvh">
      <Sidebar />
      <div
        class="h-full transition-all duration-1000"
        :class="
          sidebarOpen
            ? 'ml-21 md:ml-[275px] blur-xs md:blur-none'
            : 'ml-21 md:ml-24'
        "
        @click="handleOutClick"
      >
        <div
          class="px-2 md:px-5 py-3 flex flex-col gap-3 h-full"
          :class="
            sidebarOpen
              ? 'select-none pointer-events-none md:select-auto md:pointer-events-auto'
              : ''
          "
        >
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
  <SpeedInsights />
  <Analytics />
</template>
