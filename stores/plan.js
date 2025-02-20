import { defineStore } from "pinia";

export const usePlanStore = defineStore("plan", {
  state: () => ({
    plans: [],
  }),

  actions: {
    async fetchPlans() {
      const { data } = await useFetchWrapper("/api/plans");
      this.plans = data;
    },
  },
});
