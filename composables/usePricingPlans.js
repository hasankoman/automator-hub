import { ref } from "vue";

export const usePricingPlans = () => {
  const plans = ref([]);

  const fetchPlans = async () => {
    const { data } = await useFetchWrapper("/api/pricing-plans");
    plans.value = data;
  };

  return {
    plans,
    fetchPlans,
  };
};
