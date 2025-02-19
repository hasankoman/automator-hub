<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import { useHead } from "#imports";

useHead({
  title: "Automation Manager",
});

import { Sidebar, Header, HeaderRight } from "#components";

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
  <Toast
    position="top-right"
    :breakpoints="{
      '1024px': { width: '30vw' },
      '768px': { width: '50vw' },
      '576px': { width: '75vw' },
    }"
  />
  <div class="min-h-screen bg-gray-100">
    <div class="relative h-dvh bg-gray-100">
      <Sidebar />
      <div
        class="h-full transition-all duration-300"
        :class="sidebarOpen ? 'md:ml-[275px] blur-xs md:blur-none' : '0px'"
        @click="handleOutClick"
      >
        <div
          class="p-3 flex flex-col gap-3 h-full"
          :class="
            sidebarOpen
              ? 'select-none pointer-events-none md:select-auto md:pointer-events-auto'
              : ''
          "
        >
          <Header>
            <template #right>
              <HeaderRight
                v-if="$route.path.includes('github') && currentStep === 1"
              />
            </template>
          </Header>
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>
