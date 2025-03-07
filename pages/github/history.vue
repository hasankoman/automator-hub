<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const readmeHistoryStore = useReadmeHistoryStore();
const { history } = storeToRefs(readmeHistoryStore);

const historyHeader = ref(null);
const headerHeight = ref(0);

onMounted(async () => {
  await readmeHistoryStore.fetchHistory();

  await nextTick();
  if (historyHeader.value) {
    headerHeight.value = historyHeader.value.offsetHeight + 30;
  }
});

const formattedHistory = computed(() => {
  const repositoriesMap = new Map();

  history.value.forEach((h) => {
    if (!repositoriesMap.has(h.repositoryId)) {
      repositoriesMap.set(h.repositoryId, {
        label: h.repositoryName,
        id: h.repositoryId,
        icon: "hugeicons:ease-curve-control-points",
        child: false,
        items: [],
      });
    }

    repositoriesMap.get(h.repositoryId).items.push({
      label: `${h.operationType
        ?.charAt(0)
        .toUpperCase()}${h.operationType?.slice(1)} Update`,
      status: h.status,
      icon:
        h.status === "success"
          ? "hugeicons:checkmark-square-04"
          : "hugeicons:multiplication-sign-square",
      createdAt: h.createdAt,
      child: true,
    });
  });

  return Array.from(repositoriesMap.values());
});
</script>

<template>
  <div
    class="flex flex-col bg-gray-50 rounded-2xl overflow-hidden border-1 border-gray-200 relative"
  >
    <div
      class="p-3 md:p-5 bg-white/70 backdrop-blur-sm border-b border-gray-200 absolute top-0 z-20 w-full"
      ref="historyHeader"
    >
      <h2 class="font-bold text-gray-900">README History</h2>
      <p class="mt-2 text-sm md:text-base text-gray-600">
        View and manage your README update history
      </p>
    </div>

    <div
      class="flex-1 pb-5 px-3 md:px-5 gap-8 shadow-inner overflow-auto"
      :style="{ paddingTop: `${headerHeight}px` }"
      v-if="history"
    >
      <div
        class="p-4 bg-white rounded-xl shadow-xs flex flex-col items-center justify-between gap-1 col-span-1 border border-gray-200"
        v-if="history.length === 0"
      >
        <Icon
          name="fluent:history-48-regular"
          class="text-5xl text-black mb-2"
        />
        <p class="text-lg font-semibold text-gray-700">No history found</p>
        <p class="text-sm text-gray-500 m-0">
          You have not performed any operations yet.
        </p>
      </div>
      <div class="grid grid-cols-1 auto-rows-min gap-5" v-else>
        <PanelMenu
          :model="formattedHistory"
          multiple
          class="w-full"
          :pt="{
            panel:
              '!bg-white !rounded-xl !shadow-xs border border-gray-200 !p-1.5',
            headercontent: '!rounded-lg',
            item: '!rounded-lg overflow-hidden',
            itemcontent: '!bg-transparent',
            rootlist: 'flex flex-col gap-2 !py-2 !px-2 md:!px-3',
          }"
        >
          <template #item="{ item }">
            <a
              v-ripple
              class="flex items-center p-2 group"
              :class="
                item.child
                  ? item.status === 'success'
                    ? '!bg-green-50 text-green-600 cursor-default '
                    : '!bg-red-50 text-red-600 cursor-default '
                  : ' cursor-pointer px-4 py-3 select-none'
              "
            >
              <Icon :name="item.icon" />
              <span :class="['ml-2', { 'font-semibold': item.items }]">{{
                item.label
              }}</span>
              <span class="ml-auto text-sm">
                {{
                  item.child
                    ? $dayjs(item.createdAt).format("DD.MM.YYYY HH:mm")
                    : ""
                }}
              </span>
            </a>
          </template>
        </PanelMenu>
      </div>
    </div>
  </div>
</template>
