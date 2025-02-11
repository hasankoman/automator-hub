import { defineStore } from "pinia";
import { useFetchWrapper } from "~/composables/useFetchWrapper";

export const useGitHubStore = defineStore("github", {
  state: () => ({
    repositories: [],
    selectedRepositories: {},
    currentStep: 1,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchRepositories() {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await useFetchWrapper("/api/github-repos");

        console.log(data);

        if (error) {
          this.error = error.message;
        } else {
          this.repositories = data || [];
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async triggerAction(type) {
      if (type === "manual") {
        const keys = Object.keys(this.selectedRepositories);
        const repository = keys.length
          ? this.selectedRepositories[keys[0]]
          : null;

        if (!repository) retun;

        const { data, error } = await useFetch("/api/action", {
          method: "POST",
          body: repository,
        });

        if (error.value) {
          throw new Error(error.value);
        }
      }
    },
  },
});
