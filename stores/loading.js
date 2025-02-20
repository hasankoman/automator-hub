import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    loadingCounter: 0,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loadingCounter > 0,
  },

  actions: {
    startLoading() {
      this.loadingCounter++;
      this.error = null;
    },
    stopLoading() {
      this.loadingCounter = Math.max(0, this.loadingCounter - 1);
    },
    setError(error) {
      this.error = error;
      this.loadingCounter = 0;
    },
    clearError() {
      this.error = null;
    },
  },
});
