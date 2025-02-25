<script setup>
import { ref, onMounted, watch } from "vue";

import { storeToRefs } from "pinia";
import hamburgerArrowAnimation from "~/assets/lottie/hamburger-arrow-animation.json";

const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);
const lottieRef = ref(null);

onMounted(() => {
  setTimeout(() => {
    if (lottieRef.value) {
      if (sidebarOpen.value) {
        lottieRef.value.goToAndStop(68, true);
      } else {
        lottieRef.value.goToAndStop(0, true);
      }
    }
  }, 100);
});

const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};

watch(sidebarOpen, (newValue) => {
  if (lottieRef.value) {
    if (newValue) {
      lottieRef.value.setSpeed(1.5);
      lottieRef.value.playSegments([0, 68], true);
    } else {
      lottieRef.value.setSpeed(1);
      lottieRef.value.playSegments([68, 89], true);
    }
  }
});
</script>

<template>
  <div class="!sticky top-0 z-50 bg-gray-100 h-[60px]">
    <div
      class="flex items-center justify-end gap-3 bg-white p-2 border-1 border-gray-200 rounded-2xl h-full"
    >
      <Button
        class="w-10 h-10 mr-auto transition-all duration-1000"
        @click.stop="toggleSidebar"
        aria-label="Toggle sidebar"
        :class="{
          '!bg-transparent !border-transparent': sidebarOpen,
          '!bg-white !border-gray-200': !sidebarOpen,
        }"
        :style="{
          transform: sidebarOpen
            ? 'translateX(calc(-100% - 15px))'
            : 'translateX(0)',
          transition: 'transform 0.5s ease-in-out',
        }"
      >
        <template #icon>
          <Icon
            name="hugeicons:sidebar-right-01"
            :class="sidebarOpen ? 'rotate-y-180' : 'rotate-y-0'"
            class="text-lg text-black transition-all duration-500"
          />
        </template>
      </Button>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style>
.lottie-animation-container svg {
  width: 100%;
  height: 100%;
}
</style>
