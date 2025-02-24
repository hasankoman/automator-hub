import { defineStore } from "pinia";

export const useActionsStore = defineStore("actions", {
  state: () => ({
    actions: [],
    activeActions: {},
  }),

  getters: {
    pendingActionsCount: (state) =>
      Object.values(state.activeActions).filter(
        (action) =>
          action.status === "pending" ||
          action.status === "loading" ||
          action.status === "success" ||
          action.status === "error"
      ).length,
  },

  actions: {
    addAction(repository, type) {
      this.activeActions[repository.id] = {
        repository,
        type,
        status: "pending",
        timestamp: new Date(),
      };
    },

    updateActionStatus(repositoryId, status) {
      if (this.activeActions[repositoryId]) {
        this.activeActions[repositoryId].status = status;
      }
    },

    clearCompletedActions() {
      this.activeActions = Object.fromEntries(
        Object.entries(this.activeActions).filter(
          ([_, action]) =>
            action.status === "pending" || action.status === "loading"
        )
      );
    },
  },
});
