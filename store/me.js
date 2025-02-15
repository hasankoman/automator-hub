import { defineStore } from "pinia";

export const useMeStore = defineStore("me", {
  state: () => ({
    user: null,
    subscription: null,
  }),

  actions: {
    async fetchUser() {
      this.user = await useFetchWrapper("/api/user/me");
    },

    async fetchSubscription() {
      this.subscription = await useFetchWrapper("/api/user/subscription");
    },

    async updateSubscription(planId) {
      this.subscription = await useFetchWrapper("/api/user/subscription", {
        method: "PUT",
        body: { planId },
      });
    },
  },
});
