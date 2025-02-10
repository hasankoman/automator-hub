<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import Sidebar from "~/components/Sidebar.vue";
import { useGitHubStore } from "~/store/github";
import { useSidebarStore } from "~/store/sidebar";

const githubStore = useGitHubStore();
const { currentStep } = storeToRefs(githubStore);
const sidebarWidth = "275px";

const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);
</script>

<template>
  <div class="relative h-screen bg-gray-100">
    <div
      class="absolute top-0 left-0 h-full transition-all duration-300 overflow-hidden"
      :style="{ width: sidebarOpen ? sidebarWidth : '0px' }"
    >
      <Sidebar />
    </div>

    <div
      class="h-full transition-all duration-300"
      :style="{ marginLeft: sidebarOpen ? sidebarWidth : '0px' }"
    >
      <div class="p-3 flex flex-col h-full">
        <repositories-repository-list v-if="currentStep === 1" />
        <Actions v-if="currentStep === 2" />
      </div>
    </div>
  </div>
</template>
