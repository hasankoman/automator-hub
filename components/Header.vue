<script setup>
import { useSidebarStore } from "~/store/sidebar";

const sidebarStore = useSidebarStore();

const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};
</script>
<template>
  <div class="!sticky top-0 z-10 bg-gray-100">
    <div
      class="flex items-center justify-end gap-3 bg-white p-2 border-1 border-gray-200 rounded-2xl"
    >
      <Button
        class="w-10 h-10 !bg-white !border-gray-200 mr-auto"
        @click.stop="toggleSidebar"
      >
        <template #icon>
          <Icon name="hugeicons:menu-01" class="text-black text-xl" />
        </template>
      </Button>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style></style>
