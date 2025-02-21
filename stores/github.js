import { defineStore } from "pinia";

export const useGitHubStore = defineStore("github", {
  state: () => ({
    repositories: [],
    selectedRepositories: {},
    currentStep: 1,
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

      return data;
    },
  },
});
