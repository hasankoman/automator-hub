<script setup>
const meStore = useMeStore();
const { user } = storeToRefs(meStore);
</script>

<template>
  <div
    class="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl shadow-md"
  >
    <h2 class="text-xl font-semibold border-b border-gray-200 pb-2">
      Profile Information
    </h2>
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Name</span>
        <span class="font-medium">{{ user?.name }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Email</span>
        <span class="font-medium">{{ user?.email }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Account Created</span>
        <span class="font-medium">{{
          new Date(user?.createdAt).toLocaleDateString()
        }}</span>
      </div>
    </div>
  </div>
</template>
