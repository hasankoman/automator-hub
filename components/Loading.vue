<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useLoadingStore } from "~/store/loading";

const loadingStore = useLoadingStore();
const { isLoading, error } = storeToRefs(loadingStore);
const { clearError } = loadingStore;
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-[99999]"
    >
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
      ></div>
    </div>
  </Transition>

  <Transition name="slide-up">
    <div
      v-if="error"
      class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-red-500 p-4 shadow-lg"
    >
      <div class="flex items-center">
        <p class="mr-4 text-white">{{ error }}</p>
        <button
          @click="clearError"
          class="rounded-full bg-white/20 p-1 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 100%);
}
</style>
