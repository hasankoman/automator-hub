<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="bg-gradient-to-r from-gray-300 to-gray-800 p-0.5 rounded-xl text-2xl lg:text-3xl xl:text-4xl gradient-shine"
  >
    <div class="bg-white py-1 px-4 rounded-xl">
      <span
        class="bg-gradient-to-r from-gray-800 to-gray-400 bg-clip-text text-transparent"
        >{{ text }}</span
      >
    </div>
  </div>
</template>
<style scoped>
.gradient-shine {
  background-size: 200% auto;
  animation: textShine 1s ease-in-out infinite alternate;
}

.gradient-shine span {
  background-size: 200% auto;
  animation: textShine 1s ease-in-out infinite alternate;
}

@keyframes textShine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
</style>
