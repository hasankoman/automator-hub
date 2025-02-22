import { defineStore } from "pinia";

export const useGitHubStore = defineStore("github", {
  state: () => ({
    repositories: [],
    selectedRepositories: {},
    currentStep: 1,
    hooks: [],
  }),

  actions: {
    async fetchRepositories() {
      const { data } = await useFetchWrapper("/api/github-repos");

      this.repositories = data || [];
    },
    async triggerAction(type, repository) {
      if (type === "manual") {
        const { data, error } = await useFetch("/api/action", {
          method: "POST",
          body: repository,
        });

        if (error.value) {
          throw new Error(error.value);
        }
      }
    },
    async setupWebhook(repository) {
      const { data, error } = await useFetch("/api/github-webhooks/setup", {
        method: "POST",
        body: { repository },
      });

      if (error.value) {
        throw new Error(error.value);
      }

      return data;
    },

    async removeWebhook(repository) {
      const { data, error } = await useFetch(
        `/api/github-webhooks/${repository.fullName}`,
        {
          method: "DELETE",
        }
      );

      if (error.value) {
        throw new Error(error.value);
      }

      this.hooks = this.hooks.filter((hook) => hook.id !== repository.id);

      return data;
    },

    async fetchHooks() {
      const { data } = await useFetchWrapper(`/api/github-webhooks/list`);

      this.hooks = data;
    },
    async updateWebhook(repository, isActive) {
      try {
        const response = await $fetch(
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

        return response;
      } catch (error) {
        console.error("Error deactivating webhook:", error);
        throw error;
      }
    },
  },
});
