<script setup>
import { useLoadingStore } from "~/store/loading";
import { useSidebarStore } from "~/store/sidebar";

const { status, signIn, signOut, data } = useAuth();

const sidebarStore = useSidebarStore();

const profileDropdown = ref(null);

const openProfileDropdown = () => {
  if (!profileDropdown.value) return;
  profileDropdown.value.handleOpen();
};

const handleSignIn = async () => {
  const loadingStore = useLoadingStore();

  try {
    loadingStore.startLoading();
    await signIn();
    loadingStore.stopLoading();
  } catch (error) {
    loadingStore.setError(error.message || "An unexpected error occurred");
  }
};

const handleSignOut = async () => {
  const loadingStore = useLoadingStore();

  try {
    loadingStore.startLoading();
    await signOut();
    loadingStore.stopLoading();
  } catch (error) {
    loadingStore.setError(error.message || "An unexpected error occurred");
  }
};

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
        @click="toggleSidebar"
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
