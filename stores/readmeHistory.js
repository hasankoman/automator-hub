import { defineStore } from "pinia";

export const useReadmeHistoryStore = defineStore("readmeHistory", {
  state: () => ({
    history: [],
  }),
  actions: {
    async fetchHistory() {
      const { data } = await useFetchWrapper("/api/user/readme-history");
      this.history = data;
    },

    async createOrUpdateHistory(historyData) {
      const { data } = await useFetchWrapper("/api/user/readme-history", {
        method: "POST",
        body: historyData,
      });

      this.history.unshift(data);
    },
  },
});
