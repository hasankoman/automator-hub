<script setup>
definePageMeta({
  layout: "payment",
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const meStore = useMeStore();

const planStore = usePlanStore();
const { plans } = storeToRefs(planStore);
const loading = ref(false);

const selectedPlan = ref(null);

const cardForm = ref({
  number: "",
  expiry: "",
  cvc: "",
  name: "",
});

const cardPreview = computed(() => ({
  number: cardForm.value.number
    ? cardForm.value.number
        .split("")
        .map((char, index) => {
          const actualIndex =
            char === " "
              ? -1
              : cardForm.value.number
                  .split("")
                  .slice(0, index)
                  .filter((c) => c !== " ").length;
          if (actualIndex >= 4 && actualIndex <= 11) {
            return char === " " ? " " : char === "•" ? "•" : "*";
          }
          return char;
        })
        .join("")
    : "•••• •••• •••• ••••",
  name: cardForm.value.name || "CARD HOLDER",
  expiry: cardForm.value.expiry || "MM/YY",
  cvc: cardForm.value.cvc || "•••",
}));

const isCardFlipped = ref(false);

const flipCard = (flip) => {
  isCardFlipped.value = flip;
};

const cardType = computed(() => {
  const number = cardForm.value.number.replace(/\s/g, "");
  if (!number) return "unknown";

  // Visa
  if (number.startsWith("4")) return "visa";

  // Mastercard
  if (/^5[1-5]/.test(number)) return "mastercard";
  if (/^2[2-7]/.test(number)) return "mastercard";

  // American Express
  if (/^3[47]/.test(number)) return "amex";

  // Discover
  if (/^6(?:011|5)/.test(number)) return "discover";

  // Diners Club
  if (/^3(?:0[0-5]|[68])/.test(number)) return "diners";

  // JCB
  if (/^35/.test(number)) return "jcb";

  // Union Pay
  if (/^62/.test(number)) return "unionpay";

  // Maestro
  if (/^(5018|5020|5038|6304|6759|6761|6763)/.test(number)) return "maestro";

  return "unknown";
});

const cardLogo = computed(() => {
  switch (cardType.value) {
    case "visa":
      return "logos:visa";
    case "mastercard":
      return "logos:mastercard";
    case "amex":
      return "logos:amex-digital";
    case "discover":
      return "formkit:discover";
    default:
      return "hugeicons:credit-card";
  }
});

const handleSubmit = async () => {
  await meStore.processPayment(selectedPlan.value.id, {
    cardNumber: cardForm.value.number,
    cardName: cardForm.value.name,
    expiry: cardForm.value.expiry,
    cvc: cardForm.value.cvc,
  });

  router.push("/settings");
};

onMounted(() => {
  if (plans.value.length === 0) {
    planStore.fetchPlans();
  }

  selectedPlan.value = plans.value.find(
    (plan) =>
      plan.id === parseInt(route.params.planId) &&
      !plan.comingSoon &&
      !plan.isFree
  );

  if (!selectedPlan.value) {
    router.push("/pricing");
  }
});
</script>

<template>
  <Button
    label="Back"
    class="mb-3 !p-0 hover:!bg-transparent !hidden md:!flex"
    text
    @click="$router.go(-1)"
    v-if="selectedPlan"
  >
    <template #icon>
      <Icon name="hugeicons:arrow-left-01" class="text-xl" />
    </template>
  </Button>

  <div
    class="flex flex-col md:flex-row bg-white md:rounded-2xl overflow-hidden md:border border-gray-200"
    v-if="selectedPlan"
  >
    <div
      class="md:w-1/3 bg-black text-white md:text-black md:bg-gray-50 py-5 px-4 md:p-6 md:border-r border-gray-200"
    >
      <div v-if="selectedPlan" class="flex flex-col gap-3 md:gap-4">
        <Button
          label="Back"
          class="!p-0 !bg-transparent !text-white md:hidden mr-auto"
          text
          @click="$router.go(-1)"
        >
          <template #icon>
            <Icon name="hugeicons:arrow-left-01" class="text-xl" />
          </template>
        </Button>
        <h2 class="text-2xl font-bold">Order Summary</h2>
        <div
          class="flex justify-between items-center py-2 border-b border-gray-200"
        >
          <span class="font-medium">{{ selectedPlan.name }} Plan</span>
          <span class="text-lg font-bold">${{ selectedPlan.price }}/mo</span>
        </div>

        <div class="hidden md:flex flex-col gap-2">
          <h3 class="font-medium text-gray-700">Plan Features:</h3>
          <ul class="flex flex-col gap-2">
            <li
              v-for="feature in selectedPlan.features"
              :key="feature.name"
              class="flex items-start gap-2 text-smtext-gray-600"
            >
              <Icon
                name="hugeicons:checkmark-circle-03"
                class="text-green-500 flex-shrink-0 mt-1"
              />
              <span class="flex-1">{{ feature.name }}</span>
            </li>
          </ul>
        </div>

        <div class="md:hidden">
          <Accordion>
            <template #collapseicon>
              <Icon
                name="hugeicons:arrow-down-01"
                class="text-white text-2xl rotate-180"
              />
            </template>
            <template #expandicon>
              <Icon
                name="hugeicons:arrow-down-01"
                class="text-2xl text-white"
              />
            </template>
            <AccordionPanel
              value="0"
              :pt="{
                root: '!border-0',
              }"
            >
              <AccordionHeader
                :pt="{
                  root: '!p-0 !shadow-none !outline-none !text-white !bg-transparent !font-medium ',
                }"
              >
                Payment Features
              </AccordionHeader>
              <AccordionContent
                :pt="{
                  content: '!p-0 !pt-2 !bg-transparent',
                }"
              >
                <ul class="flex flex-col gap-2">
                  <li
                    v-for="feature in selectedPlan.features"
                    :key="feature.name"
                    class="flex items-start gap-2 text-sm text-white"
                  >
                    <Icon
                      name="hugeicons:checkmark-circle-03"
                      class="text-green-500 flex-shrink-0 mt-1"
                    />
                    <span class="flex-1">{{ feature.name }}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </div>

    <div class="md:w-2/3 p-6 shadow-inner">
      <h2 class="text-2xl font-bold mb-6">Payment Details</h2>

      <div class="relative h-45 max-w-75 md:h-50 md:max-w-90 mx-auto mb-8">
        <div
          class="absolute w-full h-full transition-all duration-700 preserve-3d shadow-lg rounded-2xl bg-transparent"
          :class="isCardFlipped ? 'rotate-y-180' : ''"
        >
          <div
            class="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden"
          >
            <div
              class="absolute w-full h-full bg-gradient-to-br from-white from-15% to-black/20 to-100% rounded-2xl"
            ></div>

            <div
              class="relative h-full p-5 text-black border-2 border-black/10 rounded-2xl"
            >
              <div class="flex flex-col h-full justify-between">
                <div class="flex justify-between items-start">
                  <Icon
                    name="hugeicons:chip"
                    class="text-3xl md:text-4xl bg-gradient-to-br from-yellow-500 to-yellow-600"
                  />
                  <div class="!w-10 md:!w-16 flex justify-end">
                    <Icon
                      :name="cardLogo"
                      class="text-2xl md:text-3xl text-black"
                    />
                  </div>
                </div>
                <div
                  class="text-black text-base md:text-lg tracking-widest font-mono"
                >
                  {{ cardPreview.number }}
                </div>
                <div class="flex justify-between items-end">
                  <div class="flex flex-col">
                    <span class="text-gray-600 text-[10px] md:text-xs"
                      >Card Holder</span
                    >
                    <span class="text-black tracking-wider text-xs md:text-sm">
                      {{ cardPreview.name.toUpperCase() }}
                    </span>
                  </div>
                  <div class="flex flex-col text-right">
                    <span class="text-gray-600 text-[10px] md:text-xs"
                      >Expires</span
                    >
                    <span class="text-black tracking-wider text-xs md:text-sm">
                      {{ cardPreview.expiry }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="absolute w-full h-full backface-hidden bg-gradient-to-br from-white from-10% to-black/20 to-100% border-2 border-black/10 rounded-2xl rotate-y-180"
          >
            <div class="w-full h-12 bg-black mt-6"></div>
            <div class="px-6 mt-6">
              <div class="flex justify-end items-center">
                <div
                  class="bg-gray-300 h-8 w-full max-w-[200px] flex items-center justify-end pr-3 italic"
                >
                  {{ cardPreview.cvc }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600">Card Holder Name</label>
          <InputText
            v-model="cardForm.name"
            class="w-full"
            placeholder="John Doe"
            required
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm text-gray-600">Card Number</label>
          <InputMask
            v-model="cardForm.number"
            mask="9999 9999 9999 9999"
            :autoClear="false"
            placeholder="4242 4242 4242 4242"
            slotChar="•"
            class="w-full"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-600">Expiry Date</label>
            <InputMask
              v-model="cardForm.expiry"
              mask="99/99"
              placeholder="MM/YY"
              slotChar="MM/YY"
              required
            />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm text-gray-600">CVC</label>
            <InputMask
              v-model="cardForm.cvc"
              mask="999"
              placeholder="123"
              required
              @focus="flipCard(true)"
              @blur="flipCard(false)"
            />
          </div>
        </div>

        <Button
          type="submit"
          :label="`Pay $${selectedPlan?.price}`"
          class="w-full mt-6"
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
</style>
