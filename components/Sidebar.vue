<script setup>
import { ref } from "vue";

const { data, status } = useAuth();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);
const meStore = useMeStore();
const loadingStore = useLoadingStore();

const isActive = (path) => route.path === path;

const isMenuOpen = ref(false);
const menu = ref();

const menuItems = [
  {
    active: false,
    label: "Notifications",
    icon: "hugeicons:notification-03",
    command: () => navigateTo("/settings"),
  },
  {
    active: true,
    label: "Settings",
    link: "/settings",
    icon: "hugeicons:settings-01",
    command: () => navigateTo("/settings"),
  },
  {
    separator: true,
    active: true,
  },
  {
    active: true,
    label: "Sign Out",
    icon: "hugeicons:logout-02",
    command: () => handleSignOut(),
  },
];

const githubLinks = [
  {
    to: "/",
    icon: "hugeicons:home-02",
    label: "Home",
  },
  {
    to: "/github",
    icon: "hugeicons:ease-curve-control-points",
    label: "Repositories",
    requiresAuth: "github",
  },
  {
    to: "/github/hooks",
    icon: "hugeicons:webhook",
    label: "Webhooks",
    requiresAuth: "github",
  },
];

const accountLinks = [
  {
    to: "/integrations",
    icon: "hugeicons:plug-socket",
    label: "Integrations",
    iconClass: "text-xl",
  },
  {
    to: "/pricing",
    icon: "hugeicons:wallet-02",
    label: "Pricing",
  },
];

const handleSignOut = async () => {
  try {
    loadingStore.startLoading();
    await meStore.signOut();
  } catch (error) {
    toastStore.error(error);
  } finally {
    loadingStore.stopLoading();
  }
};

const toggle = (event) => {
  menu.value.toggle(event);
};

const handleMenuFocus = () => {
  isMenuOpen.value = true;
};

const handleMenuBlur = () => {
  isMenuOpen.value = false;
};
</script>

<template>
  <aside
    class="h-dvh text-black py-3 px-2 md:p-5 flex flex-col z-50 bg-white md:bg-transparent w-72 fixed left-0 top-0 shadow-2xl md:shadow-none transition-all duration-300 overflow-auto"
    :class="!sidebarOpen ? '-translate-x-100' : 'translate-x-0'"
  >
    <div class="flex items-center gap-3 mb-8">
      <div
        class="flex items-center justify-center w-12 h-12 bg-[#D2CECF] rounded-full"
      >
        <img
          src="../assets/icons/gh-manager-icon.png"
          alt=""
          class="w-2/3 aspect-auto"
        />
      </div>

      <h1 class="text-xl font-semibold">AUTOMATION MANAGER</h1>
    </div>

    <nav class="mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        GITHUB
      </h2>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="link in githubLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center border-1 p-2 rounded-xl transition-all duration-300 ease-in-out font-medium',
            isActive(link.to)
              ? 'bg-white border-gray-300 shadow-sm  text-black'
              : 'hover:bg-gray-200 border-transparent text-slate-700',
            link.requiresAuth
              ? data?.user[link.requiresAuth]
                ? ''
                : 'pointer-events-none opacity-50'
              : '',
          ]"
        >
          <Icon :name="link.icon" :class="['mr-3', link.iconClass]" />
          <span>{{ link.label }}</span>
          <Icon
            v-if="link.requiresAuth && !data?.user[link.requiresAuth]"
            name="mdi:lock-outline"
            class="ml-auto"
          />
        </NuxtLink>
      </div>
    </nav>

    <nav class="mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        ACCOUNT
      </h2>
      <div class="flex flex-col gap-2">
        <NuxtLink
          v-for="link in accountLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'flex items-center border-1 p-2 rounded-xl transition-all duration-100 ease-in-out',
            isActive(link.path || link.to)
              ? 'bg-white  border-gray-300 shadow-sm  font-semibold'
              : 'hover:bg-gray-200 border-transparent',
          ]"
        >
          <Icon :name="link.icon" :class="['mr-3', link.iconClass]" />
          <span>{{ link.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div
      class="bg-white rounded-2xl border-gray-300 border-1 mt-auto flex"
      id="sidebar-footer"
    >
      <div
        class="m-2 rounded-xl p-2 gap-2 flex items-center justify-between border-1 border-gray-200 cursor-pointer flex-1 transition-all ease-in-out duration-300"
        :class="
          isMenuOpen ? 'shadow-2xs translate-y-[0.5px] bg-gray-50' : 'shadow-sm'
        "
        v-if="status === 'authenticated'"
        @click="toggle"
      >
        <div class="flex gap-2 items-center">
          <Avatar :image="data.user.image" shape="circle" />
          <span class="inline-flex flex-col items-start select-none">
            <span class="font-bold">{{ data.user.name }}</span>
          </span>
        </div>
        <Icon name="material-symbols:expand-all-rounded" class="text-xl" />
      </div>
      <Button
        label="Sign In"
        v-else
        class="m-2 shadow-sm rounded-xl p-2 gap-2 flex items-center border-1 border-gray-200 cursor-pointer flex-1"
        @click="$router.push('/auth')"
      >
        <template #icon>
          <Icon name="hugeicons:login-02" />
        </template>
      </Button>
      <Menu
        ref="menu"
        appendTo="#sidebar-footer"
        id="overlay_menu"
        :model="menuItems.filter((item) => item.active)"
        @focus="handleMenuFocus"
        @blur="handleMenuBlur"
        :popup="true"
        :pt="{
          root: '-translate-y-3 !rounded-2xl',
          list: '!p-2.5 !gap-2',
          itemcontent: ({ context: { item } }) => {
            return `${
              $route.fullPath.includes(item.link)
                ? 'bg-gray-200 hover:!bg-gray-200'
                : ''
            } !rounded-xl`;
          },
          itemLink: '!p-2',
        }"
      >
        <template #item="{ item, props }">
          <a v-ripple class="flex items-center" v-bind="props.action">
            <Icon :name="item.icon" />
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
          </a>
        </template>
      </Menu>
    </div>
  </aside>
</template>

<style scoped></style>
