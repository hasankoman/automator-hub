import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    isLoading: false,
    error: null,
  }),

  actions: {
    startLoading() {
      this.isLoading = true;
      this.error = null;
    },
    stopLoading() {
      this.isLoading = false;
    },
    setError(error) {
      this.error = error;
      this.isLoading = false;
    },
    clearError() {
      this.error = null;
    },
  },
});
