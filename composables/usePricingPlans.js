import { ref } from "vue";

export const usePricingPlans = () => {
  const plans = ref([]);

  const fetchPlans = async () => {
    plans.value = await useFetchWrapper("/api/pricing-plans");
  };

  return {
    plans,
    fetchPlans,
  };
};
