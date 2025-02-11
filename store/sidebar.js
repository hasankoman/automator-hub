import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    open: useDevice().isDesktopOrTablet,
  }),
  actions: {
    toggleSidebar() {
      this.open = !this.open;
    },
    openSidebar() {
      this.open = true;
    },
    closeSidebar() {
      this.open = false;
    },
  },
});
