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
        callbackUrl: window.location.origin + (route?.query?.redirect || "/"),
      });
    },

    async signOut() {
      const { signOut } = useAuth();

      await signOut();
    },

    async fetchUser() {
      const { status } = useAuth();
      if (status.value !== "authenticated") return;

      const { data } = await useFetchWrapper("/api/user/me");
      this.user = data;
    },

    async fetchSubscription() {
      const { status } = useAuth();
      if (status.value !== "authenticated") return;

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

    async deleteAccount() {
      const { data } = await useFetchWrapper("/api/user", {
        method: "DELETE",
      });
      return data;
    },

    async processPayment(planId, paymentDetails) {
      const { data } = await useFetchWrapper("/api/payment", {
        method: "POST",
        body: {
          planId,
          paymentDetails,
        },
      });

      if (data?.subscription) {
        this.subscription = data.subscription;
      }

      return data;
    },

    async updateSubscriptionStatus(status) {
      const { data } = await useFetchWrapper(
        "/api/user/subscription/update-status",
        {
          method: "PUT",
          body: {
            status,
          },
        }
      );
      this.subscription = data;
      return data;
    },
    async checkAccess(feature) {
      const { data } = await useFetchWrapper("/api/subscription/check-access", {
        method: "POST",
        body: { feature },
      });
      return data;
    },
  },
});
