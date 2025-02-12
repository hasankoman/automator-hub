<script setup>
import { ref } from "vue";
import { useSidebarStore } from "~/store/sidebar";
import hamburgerArrowAnimation from "~/assets/lottie/hamburger-arrow-animation.json";

const sidebarStore = useSidebarStore();
const lottieRef = ref(null);

const { open: sidebarOpen } = storeToRefs(sidebarStore);

const toggleSidebar = () => {
  sidebarStore.toggleSidebar();

  if (lottieRef.value) {
    if (!sidebarOpen.value) {
      lottieRef.value.play();
    } else {
      lottieRef.value.goToAndPlay(0, true);
    }
  }
};

const toggleDirection = () => {
  if (direction.value === "forward") {
    pause();
    lottieAnimation.value.setDirection("reverse");
    play();
    direction.value = "reverse";
  } else {
    pause();
    lottieAnimation.value.setDirection("forward");
    play();
    direction.value = "forward";
  }
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
          <client-only>
            <Vue3Lottie
              ref="lottieRef"
              :animationData="hamburgerArrowAnimation"
              :height="300"
              :width="300"
              :loop="false"
              :autoplay="false"
            />
          </client-only>
        </template>
      </Button>
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style></style>
