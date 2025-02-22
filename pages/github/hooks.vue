<script setup>
definePageMeta({
  middleware: "auth",
  authRequired: true,
});

const githubStore = useGitHubStore();
const loadingStore = useLoadingStore();

const { hooks } = storeToRefs(githubStore);

const menu = ref();

onMounted(async () => {
  await githubStore.fetchHooks();
});

const removeWebhook = async (repository) => {
  try {
    await githubStore.removeWebhook(repository);
  } catch (error) {
    console.error("Failed to remove webhook:", error);
  }
};

const updateWebhook = async (hook, isActive) => {
  try {
    if (hook.active === isActive) return;

    loadingStore.startLoading();
    await githubStore.updateWebhook(hook.repository, isActive);
    hook.active = isActive;
  } catch (error) {
    console.error("Failed to update webhook:", error);
  } finally {
    loadingStore.stopLoading();
  }
};

const toggle = (event) => {
  menu.value[0].toggle(event);
};
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div
      class="flex flex-col h-full bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-200/50 shadow-sm"
    >
      <div class="p-6 bg-white border-b border-gray-100">
        <div
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h2
              class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"
            >
              Repository Webhooks
            </h2>
            <p class="mt-1 text-gray-500">
              View and manage webhooks for your repositories
            </p>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 space-y-4">
        <div
          v-if="hooks.length === 0"
          class="flex flex-col items-center justify-center py-12 px-4"
        >
          <div
            class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4"
          >
            <Icon
              name="material-symbols-light:webhook-rounded"
              class="text-4xl text-gray-400"
            />
          </div>
          <p class="text-gray-500 text-center">No webhooks found</p>
        </div>

        <div v-else class="grid gap-4">
          <div
            v-for="hook in hooks"
            :key="hook.id"
            class="group bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-500"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center"
                >
                  <Icon
                    name="material-symbols-light:webhook-rounded"
                    class="text-2xl text-gray-700"
                  />
                </div>
                <div class="space-y-1">
                  <h3 class="font-medium text-gray-900">
                    {{ hook.repository.fullName }}
                  </h3>
                  <Badge
                    :severity="hook.active ? 'success' : 'danger'"
                    :value="hook.active ? 'Active' : 'Inactive'"
                    :pt="{
                      root: '!rounded-lg px-3 py-1.5 !min-w-auto',
                    }"
                  />
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Button
                  type="button"
                  @click="toggle"
                  outlined
                  aria-haspopup="true"
                  aria-controls="webhook-menu"
                >
                  <template #icon="{ class: iconClass }">
                    <Icon
                      name="hugeicons:more-vertical-circle-01"
                      :class="iconClass"
                    />
                  </template>
                </Button>
                <Menu
                  ref="menu"
                  id="webhook-menu"
                  :model="[
                    {
                      label: hook.active ? 'Deactivate' : 'Activate',
                      command: () => updateWebhook(hook, !hook.active),
                      icon: hook.active ? 'hugeicons:pause' : 'hugeicons:play',
                    },
                    {
                      label: 'Remove Webhook',
                      command: () => removeWebhook(hook.repository),
                      icon: 'hugeicons:delete-03',
                    },
                  ]"
                  popup
                  :pt="{
                    root: 'translate-y-1 !rounded-xl',
                    list: '!p-2.5 !gap-2',
                    itemcontent: ({ context: { item } }) => {
                      return `${
                        $route.fullPath.includes(item.link)
                          ? 'bg-gray-200 hover:!bg-gray-200'
                          : ''
                      } !rounded-lg`;
                    },
                    itemLink: '!p-2',
                  }"
                >
                  <template #item="{ item, props }">
                    <a v-ripple class="flex items-center" v-bind="props.action">
                      <Icon :name="item.icon" />
                      <span>{{ item.label }}</span>
                    </a>
                  </template>
                </Menu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.p-togglebutton.p-togglebutton-checked.active::before {
  background: #22c55e !important; /* Tailwind green-500 */
  color: #ffffff !important; /* Tailwind white */
}

.p-togglebutton.p-togglebutton-checked.inactive::before {
  background: #ef4444 !important; /* Tailwind red-500 */
  color: #ffffff !important; /* Tailwind white */
}

.p-togglebutton.p-togglebutton-checked {
  color: white !important;
}
</style>
