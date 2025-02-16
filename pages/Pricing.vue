<script setup>
import { computed } from "vue";
import { usePricingPlans } from "~/composables/usePricingPlans";

const { plans, fetchPlans } = usePricingPlans();
const meStore = useMeStore();
const router = useRouter();

const { user, subscription } = storeToRefs(meStore);

const formattedPlans = computed(() => {
  return plans.value.map((plan) => ({
    ...plan,
    period: "per month",
    billing: "billed monthly",
    spanClass: plan.name === "Starter" ? "lg:col-span-2" : "lg:col-span-1",
  }));
});

const chunkFeatures = (features) => {
  const chunkSize = 5;
  const chunks = [];
  chunks.push(features.slice(0, chunkSize));
  if (features.length > chunkSize) {
    chunks.push(features.slice(chunkSize));
  }
  return chunks;
};

const selectPlan = async (plan) => {
  if (!user.value) {
    return router.push("/auth");
  } else if (plan.isFree) {
    await meStore.updateSubscription(plan.id);
  } else {
    // Redirect to payment page
  }
};

fetchPlans();
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <div
      class="grid grid-cols-1 gap-5 p-5 bg-white rounded-2xl overflow-auto border-1 border-gray-200 shadow-inner"
    >
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl m-0 font-bold">Pricing Plans</h2>
        <span class="text-gray-500"
          >Select the plan that best suits your needs.
        </span>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div
          v-for="plan in formattedPlans"
          :key="plan.id"
          :class="[
            'rounded-[30px] md:rounded-[36px] bg-[#FAFAFA] overflow-hidden border-1 border-y-3 border-black p-8 relative shadow-lg',
            plan.spanClass,
          ]"
        >
          <span
            v-if="plan.comingSoon"
            class="absolute right-0 top-0 text-2xl text-white bg-black rounded-bl-2xl pl-3 pr-4 py-2 shadow-xl border-b-1 border-l-1 border-gray-200"
          >
            Coming Soon
          </span>
          <div
            class="absolute right-0 top-0 bg-black text-white rounded-bl-2xl pl-3 pr-4 py-2 shadow-xl border-b-1 border-l-1 border-gray-200"
            v-if="subscription?.planId === plan.id"
          >
            Your Plan
          </div>
          <div class="h-full">
            <div class="h-full z-10 relative">
              <div
                class="flex flex-col flex-1 justify-between h-full space-y-5"
              >
                <div class="flex justify-between flex-col">
                  <div
                    class="text-xl md:text-2xl font-bold text-gray-900 flex justify-between"
                  >
                    <span>{{ plan.name }}</span>
                  </div>
                  <div
                    class="text-gray-700 flex justify-between border-b-1 border-gray-200 pb-4"
                  >
                    <span>{{ plan.description }}</span>
                  </div>

                  <div
                    class="pt-4 text-gray-500 font-medium text-base space-y-1"
                  >
                    <div class="flex items-center align-bottom">
                      <span class="pt-1.5">$</span>
                      <div
                        class="ml-1 mr-2 text-2xl md:text-3xl font-bold text-gray-900"
                      >
                        <span>{{ plan.price }}</span>
                      </div>
                      <span class="pt-1.5">{{ plan.period }}</span>
                    </div>
                    <div class="text-base">{{ plan.billing }}</div>
                  </div>
                  <div
                    class="flex flex-col lg:flex-row gap-2 mt-4 pt-4 border-t-1 border-gray-200"
                  >
                    <template
                      v-for="(chunk, chunkIndex) in chunkFeatures(
                        plan.features
                      )"
                      :key="chunkIndex"
                    >
                      <ul class="flex flex-col gap-2">
                        <li
                          v-for="(feature, idx) in chunk"
                          :key="idx"
                          :class="[
                            'flex items-center font-medium space-x-2',
                            feature.available ? 'text-black' : 'text-gray-600',
                          ]"
                        >
                          <Icon
                            name="hugeicons:checkmark-circle-03"
                            class="text-black min-w-4"
                          />
                          <span v-if="feature.name.split('/').length === 1">{{
                            feature.name
                          }}</span>
                          <span v-else
                            >{{ feature.name.split("/")[0]
                            }}<span class="text-gray-500 text-xs">
                              {{ `/per ${feature.name.split("/")[1]}` }}
                            </span>
                          </span>
                        </li>
                      </ul>
                    </template>
                  </div>
                </div>
                <div class="pt-2" v-if="subscription?.planId !== plan.id">
                  <Button
                    :label="
                      plan.isFree ? 'Start Free' : 'Upgrade to ' + plan.name
                    "
                    @click="selectPlan(plan)"
                  >
                    <template #icon>
                      <Icon
                        name="hugeicons:arrow-right-02"
                        class="text-white text-3xl"
                      />
                    </template>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
