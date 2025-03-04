<script setup>
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const loadingStore = useLoadingStore();
const { isLoading, error } = storeToRefs(loadingStore);
const { clearError } = loadingStore;

watch(error, (newError) => {
  if (newError) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: newError || "An error occurred",
      life: 3000,
    });
    clearError();
  }
});
</script>

<template>
  <Toast
    position="top-right"
    :breakpoints="{
      '1024px': { width: '30vw' },
      '768px': { width: '50vw' },
      '576px': { width: '75vw' },
    }"
    :pt="{
      messageIcon: 'mt-1',
    }"
  />
  <Transition name="fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm z-[99999]"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"
      ></div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
