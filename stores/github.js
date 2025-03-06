import { defineStore } from "pinia";

export const useGitHubStore = defineStore("github", {
  state: () => ({
    repositories: [],
    selectedRepositories: {},
    currentStep: 1,
    hooks: [],
    selectedAction: null,
  }),

  actions: {
    async fetchRepositories(type) {
      const params = new URLSearchParams({
        type,
      });

      const response = await useFetchWrapper(
        `/api/github-repos?${params.toString()}`
      );

      this.repositories = response.data || [];
    },
    async triggerAction(type, repository) {
      if (type === "manual") {
        await useFetchWrapper(
          "/api/action",
          {
            method: "POST",
            body: repository,
          },
          false
        );
      }
    },
    async setupWebhook(repository) {
      const response = await useFetchWrapper("/api/github-webhooks/setup", {
        method: "POST",
        body: { repository },
      });

      return response.data;
    },

    async removeWebhook(repository) {
      const response = await useFetchWrapper(
        `/api/github-webhooks/${repository.fullName}`,
        {
          method: "DELETE",
        }
      );

      this.hooks = this.hooks.filter(
        (hook) => hook.id !== repository.webhookId
      );

      return response.data;
    },

    async fetchHooks() {
      const response = await useFetchWrapper(`/api/github-webhooks/list`);

      this.hooks = response.data || [];
    },
    async updateWebhook(repository, isActive) {
      const response = await useFetchWrapper(
        `/api/github-webhooks/${repository.fullName}`,
        {
          method: "POST",
          body: {
            isActive,
          },
        }
      );

      this.hooks = this.hooks.map((hook) => {
        if (hook.id === repository.webhookId) {
          return { ...hook, active: isActive };
        }
        return hook;
      });

      return response.data;
    },
    resetState() {
      this.repositories = [];
      this.selectedRepositories = {};
      this.currentStep = 1;
      this.hooks = [];
      this.selectedAction = null;
    },
  },
});
