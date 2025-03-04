<script setup>
const router = useRouter();

const props = defineProps({
  error: Object,
});

const getErrorDetails = () => {
  switch (props.error.statusCode) {
    case 404:
      return {
        title: "Page Not Found",
        description:
          props.error.message ||
          "The page you are looking for doesn't exist or has been moved",
        icon: "hugeicons:information-circle",
      };
    case 403:
      return {
        title: "Access Denied",
        description:
          props.error.message ||
          "You don't have permission to access this resource",
        icon: "hugeicons:lock-01",
      };
    case 401:
      return {
        title: "Unauthorized",
        description:
          props.error.message || "Please sign in to access this resource",
        icon: "hugeicons:login-02",
      };
    default:
      return {
        title: "Something Went Wrong",
        description: props.error.message || "An unexpected error occurred",
        icon: "solar:shield-warning-broken",
      };
  }
};

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="flex items-center justify-center h-dvh w-dvw bg-gray-50">
    <div
      class="bg-white rounded-2xl p-8 border border-gray-200 shadow-md max-w-lg w-full mx-4"
    >
      <div class="flex flex-col items-center gap-4 text-center">
        <div
          class="bg-red-50 p-5 rounded-full flex items-center justify-center"
        >
          <Icon :name="getErrorDetails().icon" class="text-5xl text-red-500" />
        </div>

        <h1 class="text-2xl font-bold text-gray-900">
          {{ getErrorDetails().title }}
        </h1>

        <p class="text-gray-600 mb-6">{{ getErrorDetails().description }}</p>

        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <Button label="Go Back" outlined class="flex-1" @click="goBack">
            <template #icon>
              <Icon name="hugeicons:arrow-left-01" class="text-xl" />
            </template>
          </Button>

          <Button label="Go Home" class="flex-1" @click="goHome">
            <template #icon>
              <Icon name="hugeicons:home-01" class="text-xl" />
            </template>
          </Button>
        </div>
      </div>
    </div>
  </div>

  <Toast
    position="top-right"
    :breakpoints="{
      '1024px': { width: '30vw' },
      '768px': { width: '50vw' },
      '576px': { width: '75vw' },
    }"
    :pt="{
      messageIcon: 'mt-1',
    }"
  />
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
