import { defineStore } from "pinia";

export const useReadmeOperationsStore = defineStore("readmeOperations", {
  state: () => ({
    operations: [],
  }),
  actions: {
    async fetchOperations() {
      const { data } = await useFetchWrapper("/api/user/readme-operations");
      this.operations = data;
    },

    async createOrUpdateOperation(operationData) {
      const { data } = await useFetchWrapper("/api/user/readme-operations", {
        method: "POST",
        body: operationData,
      });

      this.operations.unshift(data);
    },
  },
});
