import { defineStore } from "pinia";

export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    open: true,
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
