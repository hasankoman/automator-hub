export const useFetchWrapper = async (url, options, loading = true) => {
  const loadingStore = useLoadingStore();

  try {
    if (loading) {
      loadingStore.startLoading();
    }
    const response = await $fetch(url, {
      ...options,
      body: JSON.stringify(options?.body),
    });
    return response;
  } catch (error) {
    const errorData = error.data || {};
    loadingStore.setError(errorData.message || "An unexpected error occurred");
    throw errorData;
  } finally {
    if (loading) {
      loadingStore.stopLoading();
    }
  }
};
