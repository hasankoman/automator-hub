<script setup>
import { watch } from "vue";
import { storeToRefs } from "pinia";
import Sidebar from "~/components/Sidebar.vue";
import { useSidebarStore } from "~/store/sidebar";

const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);
const route = useRoute();

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
  <div class="relative h-screen bg-gray-100">
    <Sidebar />

    <div
      class="h-full transition-all duration-300"
      :class="sidebarOpen ? 'md:ml-[275px] blur-xs md:blur-none' : '0px'"
      @click="handleOutClick"
    >
      <div class="p-3 flex flex-col h-full">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>
