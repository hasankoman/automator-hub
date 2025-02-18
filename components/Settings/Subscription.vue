<script setup>
const router = useRouter();

const meStore = useMeStore();

const { subscription } = storeToRefs(meStore);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const navigateToPricing = () => {
  router.push("/pricing");
};
</script>

<template>
  <div
    class="border-1 border-gray-200 shadow-md rounded-xl p-4 flex flex-col gap-3"
  >
    <h2 class="text-xl font-semibold border-b border-gray-200 pb-2">
      Subscription
    </h2>
    <div class="flex flex-col gap-2">
      <div v-if="subscription">
        <div v-if="subscription.status === 'active'" class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Current Plan</span>
            <span class="font-medium">{{ subscription.plan.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Status</span>
            <span
              class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
            >
              Active
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Start Date</span>
            <span>{{ formatDate(subscription.startDate) }}</span>
          </div>
          <div
            v-if="subscription.endDate"
            class="flex justify-between items-center"
          >
            <span class="text-gray-500">End Date</span>
            <span>{{ formatDate(subscription.endDate) }}</span>
          </div>
        </div>

        <div v-else>
          <span class="text-gray-500"
            >Your subscription is {{ subscription.status }}.</span
          >
        </div>
      </div>

      <span v-else class="text-gray-500">You do not have a subscription.</span>
    </div>

    <Button
      v-if="subscription"
      label="UPGRADE TO STARTER"
      class="text-sm"
      @click="navigateToPricing"
    />
    <Button
      v-else
      label="MANAGE SUBSCRIPTION"
      class="text-sm"
      @click="navigateToPricing"
    />
  </div>
</template>
