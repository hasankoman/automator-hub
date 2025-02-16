import { defineStore } from "pinia";
import { useToast } from "primevue/usetoast";

export const useToastStore = defineStore("toast", {
  state: () => ({}),
  actions: {
    showError(message) {
      const toast = useToast();

      toast.add({
        severity: "error",
        summary: "Error",
        detail: message,
        detail: 3000,
      });
    },
    showSuccess(message) {
      const toast = useToast();

      toast.add({
        severity: "success",
        summary: "Success",
        detail: message,
        life: 3000,
      });
    },
  },
});
