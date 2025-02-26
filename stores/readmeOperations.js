import { defineStore } from "pinia";
import { ref } from "vue";

export const useReadmeOperationsStore = defineStore("readmeOperations", () => {
  const operations = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchOperations = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await useFetch("/api/user/readme-operations");
      operations.value = response.data.value;
    } catch (err) {
      error.value = err.message || "Failed to fetch readme operations";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  };

  const createOrUpdateOperation = async (operationData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch("/api/user/readme-operations", {
        method: "POST",
        body: operationData,
      });

      // Yeni işlemi listeye ekle
      operations.value = [response, ...operations.value];
      return response;
    } catch (err) {
      error.value = err.message || "Failed to create readme operation";
      console.error(err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    operations,
    isLoading,
    error,
    fetchOperations,
    createOrUpdateOperation,
  };
});
