export const useFetchWrapper = async (url, options) => {
  const loadingStore = useLoadingStore();

  try {
    loadingStore.startLoading();
    const response = await $fetch(url, {
      ...options,
      body: JSON.stringify(options?.body),
    });
    return response;
  } catch (error) {
    loadingStore.setError(error.message || "An unexpected error occurred");
    throw error;
  } finally {
    loadingStore.stopLoading();
  }
};
