<script setup>
useHead({
  title: "Pricing Plans",
  meta: [
    {
      name: "description",
      content:
        "Explore our pricing plans to automate your GitHub documentation with AI-powered features.",
    },
    {
      property: "og:title",
      content: "Pricing Plans - Automate Your GitHub Documentation",
    },
    {
      property: "og:description",
      content:
        "Explore our pricing plans to automate your GitHub documentation with AI-powered features.",
    },
    {
      property: "og:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
    { property: "og:url", content: "https://www.automator-hub.com/pricing" },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: "Pricing Plans - Automate Your GitHub Documentation",
    },
    {
      name: "twitter:description",
      content:
        "Explore our pricing plans to automate your GitHub documentation with AI-powered features.",
    },
    {
      name: "twitter:image",
      content: "https://www.automator-hub.com/_nuxt/gh-manager-icon.png",
    },
  ],
});

const planStore = usePlanStore();
const meStore = useMeStore();
const sidebarStore = useSidebarStore();
const router = useRouter();

import { Swiper, SwiperSlide } from "swiper/vue";

import "swiper/css";

import "swiper/css/effect-cards";
import "swiper/css/effect-coverflow";

import { EffectCards, EffectCoverflow } from "swiper/modules";

const { user, subscription } = storeToRefs(meStore);
const { open: isSidebarOpen } = storeToRefs(sidebarStore);
const { plans } = storeToRefs(planStore);

const pricingHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  if (plans.value.length === 0) {
    await planStore.fetchPlans();
  }

  await nextTick();
  if (pricingHeader.value) {
    headerHeight.value = pricingHeader.value.offsetHeight + 30;
  }
});

const formattedPlans = computed(() => {
  return plans.value.map((plan) => ({
    ...plan,
    period: "per month",
    billing: "billed monthly",
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
    if (subscription.value?.planId) {
      return router.push(`/settings`);
    } else {
      await meStore.updateSubscription(plan.id);
    }
  } else {
    return router.push(`/payment/${plan.id}`);
  }
};

const onSwiperInit = async (swiper) => {
  swiper.slideToLoop(1, 750, true);
  return;
  setTimeout(() => {
    swiper.slideToLoop(2, 400, true);
  }, 400);
  setTimeout(() => {
    swiper.slideToLoop(1, 400, true);
  }, 800);
  setTimeout(() => {
    swiper.slideToLoop(0, 400, true);
  }, 1200);
};
</script>

<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
    v-if="formattedPlans.length > 0"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="pricingHeader"
    >
      <h2 class="font-bold text-gray-900">Pricing Plans</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        Select the plan that best suits your needs.
      </p>
    </div>

    <div
      class="flex-1 pb-5 gap-8 overflow-x-hidden overflow-y-auto flex items-center justify-center shadow-inner"
      :style="{ paddingTop: `${headerHeight}px` }"
    >
      <div class="hidden lg:block">
        <Swiper
          @afterInit="onSwiperInit"
          :effect="'coverflow'"
          :grabCursor="true"
          :centeredSlides="true"
          :slidesPerView="'auto'"
          :coverflowEffect="{
            rotate: 30,
            stretch: -30,
            depth: 200,
            modifier: 1,
            slideShadows: false,
          }"
          :modules="[EffectCoverflow]"
          class="!overflow-visible"
        >
          <SwiperSlide
            v-for="plan in formattedPlans"
            :key="plan.id"
            :class="[
              'p-4 md:p-6 !w-1/3 transition-all duration-200 h-full rounded-xl max-w-80 my-auto shadow-xl',
              plan.recommended
                ? 'bg-radial-[at_50%_130%] from-black to-gray-400 to-150% text-white border-1 border-white'
                : 'bg-white border-1 border-black/20',
            ]"
          >
            <div class="flex flex-col gap-y-4 h-full">
              <div class="flex flex-col gap-y-2 border-b border-gray-200 pb-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold">
                    {{ plan.name }}
                  </h3>
                  <div class="flex gap-1 items-center">
                    <span
                      class="text-xs font-medium px-2 py-0.5 border-1 rounded-lg"
                      :class="
                        plan.recommended
                          ? 'border-white text-white'
                          : 'border-black text-black'
                      "
                      v-if="subscription?.planId === plan.id"
                      >Current Plan</span
                    >
                    <span
                      class="text-xs font-medium px-3 py-1 bg-black text-white border-1 border-white rounded-lg absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-lg"
                      v-if="plan.recommended"
                    >
                      Recommended
                    </span>
                  </div>
                </div>
                <p class="text-sm">{{ plan.description }}</p>
              </div>

              <div class="flex flex-col gap-y-1">
                <div class="flex items-baseline">
                  <span class="text-3xl font-bold">${{ plan.price }}</span>
                  <span class="ml-1">{{ plan.period }}</span>
                </div>
              </div>

              <div class="flex gap-y-4">
                <ul class="flex flex-col gap-y-3">
                  <li
                    v-for="(feature, idx) in plan.features"
                    :key="idx"
                    :class="[
                      'flex items-start gap-2 text-sm',
                      feature.available ? '' : 'text-gray-400',
                    ]"
                  >
                    <Icon
                      name="hugeicons:checkmark-circle-03"
                      class="text-primary flex-shrink-0 mt-0.5 h-5 w-5"
                    />
                    <span v-if="feature.name.split('/').length === 1">{{
                      feature.name
                    }}</span>
                    <span v-else>
                      {{ feature.name.split("/")[0] }}
                      <span class="text-xs">
                        {{ `/per ${feature.name.split("/")[1]}` }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div class="mt-auto" v-if="subscription?.planId !== plan.id">
                <Button
                  :disabled="plan.comingSoon"
                  :class="[
                    'w-full justify-center transition-all',
                    plan.comingSoon ? 'opacity-70' : '',
                  ]"
                  :variant="plan.isFree ? 'outline' : 'default'"
                  :label="
                    plan.comingSoon
                      ? 'Coming Soon'
                      : !subscription?.planId
                      ? `Start with ${plan.name}`
                      : !subscription?.plan?.isFree
                      ? plan.isFree
                        ? 'Downgrade to Free Plan'
                        : `Upgrade to ${plan.name}`
                      : `Upgrade to ${plan.name}`
                  "
                  @click="selectPlan(plan)"
                >
                  <template #icon>
                    <Icon name="hugeicons:arrow-right-02" class="h-5 w-5" />
                  </template>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div class="block lg:hidden max-w-11/12 sm:max-w-4/5 md:max-w-3/5">
        <Swiper
          @afterInit="onSwiperInit"
          effect="cards"
          :cardsEffect="{
            perSlideRotate: 3,
            slideShadows: false,
          }"
          :grabCursor="true"
          :modules="[EffectCards]"
        >
          <SwiperSlide
            v-for="plan in formattedPlans"
            :key="plan.id"
            :class="[
              'px-4 md:px-6 py-6 md:py-8 w-1/2 transition-all duration-200 h-full rounded-xl  shadow-xl',
              plan.recommended
                ? 'bg-radial-[at_50%_130%] from-black to-gray-400 to-150% text-white border-1 border-white !overflow-visible'
                : 'bg-white border-1 border-black/20',
            ]"
          >
            <div class="flex flex-col gap-y-4 h-full">
              <div class="flex flex-col gap-y-2 border-b border-gray-200 pb-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold">
                    {{ plan.name }}
                  </h3>
                  <div class="flex gap-1 items-center">
                    <span
                      class="text-xs font-medium px-2 py-0.5 border-1 rounded-lg"
                      :class="
                        plan.recommended
                          ? 'border-white text-white'
                          : 'border-black text-black'
                      "
                      v-if="subscription?.planId === plan.id"
                      >Current Plan</span
                    >
                    <span
                      class="text-xs font-medium px-3 py-1 bg-black text-white border-1 border-white rounded-lg absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-lg"
                      v-if="plan.recommended"
                    >
                      Recommended
                    </span>
                  </div>
                </div>
                <p class="text-sm">{{ plan.description }}</p>
              </div>

              <div class="flex flex-col gap-y-1">
                <div class="flex items-baseline">
                  <span class="text-3xl font-bold">${{ plan.price }}</span>
                  <span class="ml-1">{{ plan.period }}</span>
                </div>
              </div>

              <div class="flex gap-y-4">
                <ul class="flex flex-col gap-y-3">
                  <li
                    v-for="(feature, idx) in plan.features"
                    :key="idx"
                    :class="[
                      'flex items-start gap-2 text-sm',
                      feature.available ? '' : 'text-gray-400',
                    ]"
                  >
                    <Icon
                      name="hugeicons:checkmark-circle-03"
                      class="text-primary flex-shrink-0 mt-0.5 h-5 w-5"
                    />
                    <span v-if="feature.name.split('/').length === 1">{{
                      feature.name
                    }}</span>
                    <span v-else>
                      {{ feature.name.split("/")[0] }}
                      <span class="text-xs">
                        {{ `/per ${feature.name.split("/")[1]}` }}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div class="mt-auto" v-if="subscription?.planId !== plan.id">
                <Button
                  :disabled="plan.comingSoon"
                  :class="[
                    'w-full justify-center transition-all',
                    plan.comingSoon ? 'opacity-70' : '',
                  ]"
                  :variant="plan.isFree ? 'outline' : 'default'"
                  :label="
                    plan.comingSoon
                      ? 'Coming Soon'
                      : !subscription?.planId
                      ? `Start with ${plan.name}`
                      : !subscription?.plan?.isFree
                      ? plan.isFree
                        ? 'Downgrade to Free Plan'
                        : `Upgrade to ${plan.name}`
                      : `Upgrade to ${plan.name}`
                  "
                  @click="selectPlan(plan)"
                  :pt="{
                    label: 'text-sm',
                  }"
                >
                  <template #icon>
                    <Icon name="hugeicons:arrow-right-02" class="h-5 w-5" />
                  </template>
                </Button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticky {
  position: sticky;
  backdrop-filter: blur(8px);
}
</style>
