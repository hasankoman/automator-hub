import { defineStore } from "pinia";

export const useMeStore = defineStore("me", {
  state: () => ({
    user: null,
    subscription: null,
    usage: {},
  }),

  actions: {
    async signIn() {
      const { signIn } = useAuth();
      const route = useRoute();

      await signIn("github", {
        callbackUrl: window.location.origin + route?.query?.redirect || "/",
      });
    },

    async signOut() {
      const { signOut } = useAuth();

      await signOut();
    },

    async fetchUser() {
      const { data } = await useFetchWrapper("/api/user/me");
      this.user = data;
    },

    async fetchSubscription() {
      const { data } = await useFetchWrapper("/api/user/subscription");
      this.subscription = data;
    },

    async updateSubscription(planId) {
      const { data } = await useFetchWrapper("/api/user/subscription", {
        method: "PUT",
        body: { planId },
      });
      this.subscription = data;
    },

    async fetchUsage() {
      const { data } = await useFetchWrapper("/api/user/usage");
      this.usage = data;
    },
  },
});
