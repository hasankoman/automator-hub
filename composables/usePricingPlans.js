import { ref } from "vue";
import { useLoadingStore } from "~/store/loading";

export const usePricingPlans = () => {
  const plans = ref([]);
  const error = ref(null);
  const loadingStore = useLoadingStore();

  const fetchPlans = async () => {
    loadingStore.startLoading();
    try {
      const response = await fetch("/api/pricing-plans");
      const data = await response.json();
      plans.value = data;
    } catch (err) {
      error.value = err.message;
      loadingStore.setError(err.message);
    } finally {
      loadingStore.stopLoading();
    }
  };

  return {
    plans,
    error,
    fetchPlans,
  };
};
