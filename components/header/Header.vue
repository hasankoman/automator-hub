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
  <div class="!sticky top-0 z-10 bg-gray-100 h-[60px]">
    <div
      class="flex items-center justify-end gap-3 bg-white p-2 border-1 border-gray-200 rounded-2xl h-full"
    >
      <Button
        class="w-10 h-10 !bg-white !border-gray-200 mr-auto"
        @click.stop="toggleSidebar"
      >
        <template #icon>
          <client-only>
            <Vue3Lottie
              ref="lottieRef"
              :scale="4"
              class="w-full h-full"
              width="100%"
              height="100%"
              :animationData="hamburgerArrowAnimation"
              :loop="false"
              :autoPlay="false"
            />
          </client-only>
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
