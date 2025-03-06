<script setup>
const dayjs = useDayjs();

const router = useRouter();

const meStore = useMeStore();

const { subscription } = storeToRefs(meStore);

const confirm = useConfirm();

const navigateToPricing = () => {
  router.push("/pricing");
};

const cancelSubscription = () => {
  const endDate = subscription.value?.endDate || subscription.value?.startDate;
  const planName = subscription.value?.plan?.name;

  confirm.require({
    group: "cancel-subscription",
    header: "Cancel Subscription",
    message: `Are you sure you want to cancel your ${planName} subscription?`,
    detail: `Your subscription will remain active until <b class="text-gray-600">${dayjs(
      endDate
    ).format(
      "MMMM D, YYYY"
    )}</b>. You'll continue to have full access to all <b class="text-gray-600">${planName}</b> features until then. After this date, your account will revert to the Free plan.`,
    rejectProps: {
      label: "Keep Subscription",
      outlined: true,
    },
    acceptProps: {
      label: "Cancel Subscription",
      severity: "danger",
    },
    accept: async () => {
      try {
        await meStore.updateSubscriptionStatus("cancelled");
        toast.add({
          severity: "success",
          summary: "Subscription Cancelled",
          detail: "Your subscription has been successfully cancelled",
          life: 3000,
        });
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to cancel subscription. Please try again.",
          life: 3000,
        });
      }
    },
  });
};

const reactivateSubscription = async () => {
  try {
    await meStore.updateSubscriptionStatus("active");
    toast.add({
      severity: "success",
      summary: "Subscription Reactivated",
      detail: "Your subscription has been successfully reactivated",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to reactivate subscription. Please try again.",
      life: 3000,
    });
  }
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
        <div
          v-if="
            subscription.status === 'active' ||
            subscription.status === 'cancelled'
          "
          class="gap-2 flex flex-col"
        >
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Current Plan</span>
            <span class="font-medium">{{ subscription?.plan?.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Status</span>
            <span
              :class="`px-2 py-1 ${
                subscription.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              } rounded-full text-sm capitalize`"
            >
              {{ subscription.status }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Start Date</span>
            <span>{{
              dayjs(subscription.startDate).format("MMMM D, YYYY")
            }}</span>
          </div>
          <div
            v-if="subscription.endDate"
            class="flex justify-between items-center"
          >
            <span class="text-gray-500">End Date</span>
            <span>{{
              dayjs(subscription.endDate).format("MMMM D, YYYY")
            }}</span>
          </div>
        </div>
      </div>

      <span v-else class="text-gray-500">You do not have a subscription.</span>
    </div>

    <div class="flex gap-2 border-t border-gray-200 pt-3">
      <template v-if="subscription">
        <Button
          v-if="subscription.plan.isFree"
          label="UPGRADE PLAN"
          class="!text-sm flex-1"
          @click="navigateToPricing"
        />
        <Button
          v-else-if="subscription?.status === 'active'"
          label="CANCEL SUBSCRIPTION"
          class="!text-sm flex-1"
          @click="cancelSubscription"
          severity="danger"
        />
        <Button
          v-else-if="subscription?.status === 'cancelled'"
          label="REACTIVATE SUBSCRIPTION"
          class="!text-sm flex-1"
          @click="reactivateSubscription"
        />
      </template>
      <Button
        v-if="!subscription"
        label="MANAGE SUBSCRIPTION"
        class="!text-sm flex-1"
        @click="navigateToPricing"
      />
    </div>
  </div>
  <ConfirmDialog
    group="cancel-subscription"
    :pt="{
      root: '!rounded-xl w-full md:w-1/2 mx-3 max-w-lg',
      content: '!gap-2',
      header: '!hidden',
    }"
  >
    <template #message="{ message: { message, detail } }">
      <div class="flex gap-3 pt-5">
        <div class="flex-shrink-0">
          <Icon
            class="text-4xl text-red-500"
            name="solar:shield-warning-broken"
          />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <span class="font-semibold">{{ message }}</span>
          <span class="text-sm text-gray-400" v-html="detail"></span>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>
