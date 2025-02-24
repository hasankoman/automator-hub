<script setup>
import { storeToRefs } from "pinia";

const actionsStore = useActionsStore();
const { activeActions, pendingActionsCount } = storeToRefs(actionsStore);

const menu = ref();
const isMenuOpen = ref(false);

const toggle = (event) => {
  menu.value.toggle(event);
};

const getStatusIcon = (status) => {
  switch (status) {
    case "loading":
      return "line-md:loading-loop";
    case "pending":
      return "hugeicons:clock-01";
    case "success":
      return "hugeicons:checkmark-circle-03";
    case "error":
      return "hugeicons:alert-01";
    default:
      return "hugeicons:clock-01";
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "loading":
      return "text-gray-600";
    case "pending":
      return "text-gray-600";
    case "success":
      return "text-emerald-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-600";
  }
};
</script>

<template>
  <div class="relative">
    <Button
      v-tooltip.bottom="'Active Actions'"
      class="relative !w-10 !h-10 !bg-white !border-gray-200"
      @click="toggle"
      v-if="pendingActionsCount > 0"
    >
      <template #icon>
        <div class="relative">
          <Icon name="hugeicons:play-circle" class="text-xl" />
          <div
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
          >
            {{ pendingActionsCount }}
          </div>
        </div>
      </template>
    </Button>

    <Menu
      ref="menu"
      :model="Object.values(activeActions)"
      :popup="true"
      :pt="{
        root: 'w-80 !rounded-xl',
        content: '!p-2',
      }"
    >
      <template #item="{ item }">
        <div class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
          <Icon
            :name="getStatusIcon(item.status)"
            :class="['!w-5 !h-5', getStatusClass(item.status)]"
          />
          <div class="flex-1">
            <div class="font-medium text-sm">{{ item.repository.name }}</div>
            <div class="text-xs text-gray-500">
              {{ item.type === "auto" ? "Auto Update" : "Manual Update" }}
            </div>
          </div>
        </div>
      </template>
    </Menu>
  </div>
</template>
