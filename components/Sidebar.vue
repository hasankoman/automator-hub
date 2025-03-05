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
const mainLinks = [
  {
    to: "/",
    icon: "hugeicons:home-02",
    label: "Home",
  },
];

const githubLinks = [
  {
    to: "/github",
    icon: "hugeicons:ease-curve-control-points",
    label: "Repositories",
    requiresAuth: "github",
  },
  {
    to: "/github/hooks",
    icon: "material-symbols-light:webhook-rounded",
    label: "Webhooks",
    requiresAuth: "github",
  },
  {
    to: "/github/history",
    icon: "fluent:history-48-regular",
    label: "History",
    requiresAuth: "github",
  },
];

const accountLinks = [
  {
    to: "/integrations",
    icon: "hugeicons:plug-socket",
    label: "Integrations",
  },
  {
    to: "/pricing",
    icon: "hugeicons:wallet-02",
    label: "Pricing",
  },
];

const navCategories = [
  {
    title: "Main",
    links: mainLinks,
  },
  {
    title: "Github",
    links: githubLinks,
  },
  {
    title: "Account",
    links: accountLinks,
  },
];

const handleSignOut = async () => {
  try {
    loadingStore.startLoading();
    await meStore.signOut();
  } catch (error) {
    loadingStore.setError(error.message || "An unexpected error occurred");
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

const toggleSidebar = () => {
  sidebarStore.toggleSidebar();
};
</script>

<template>
  <aside
    class="h-dvh text-black py-3 px-2 md:px-5 flex flex-col gap-3 z-50 fixed left-0 top-0 transition-all duration-1000"
    :class="sidebarOpen ? 'w-75' : 'w-19 md:w-30'"
  >
    <div
      class="p-1 rounded-xl bg-white h-full flex flex-col overflow-hidden border-1 border-gray-200"
    >
      <div class="flex flex-col gap-3 bg-gray-50 rounded-xl h-full pb-4">
        <div
          class="flex gap-2 items-center border-b pt-4 border-gray-200 px-2 md:px-3 relative transition-all duration-1000 sidebar"
          :class="sidebarOpen ? 'pb-4 sidebar-open' : 'pb-16 sidebar-closed'"
        >
          <img
            src="../assets/icons/gh-manager-icon.png"
            alt=""
            class="w-8.5 min-w-8.5 md:min-w-11.5 min-h-8.5 md:min-h-11.5 max-w-8.5 md:max-w-11.5 max-h-8.5 md:max-h-11.5 aspect-auto rounded-xl"
          />

          <h1
            class="text-md font-semibold whitespace-nowrap transition-all duration-1000"
            :class="
              sidebarOpen
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-full'
            "
          >
            <span class="text-lg font-bold">Automator</span>
            <span class="text-md font-semibold">Hub</span>
          </h1>
          <Button
            class="max-w-8 max-h-8 rounded-xl !bg-transparent !border-0 !outline-0"
            @click.stop="toggleSidebar"
            aria-label="Toggle sidebar"
          >
            <template #icon>
              <Icon
                name="hugeicons:sidebar-right-01"
                :style="{
                  transition: 'transform 0.5s ease-in-out',
                  transform: sidebarOpen ? 'rotateZ(-180deg)' : 'rotateZ(0deg)',
                }"
                class="text-black transition-all duration-500"
              />
            </template>
          </Button>
        </div>

        <nav
          v-for="(category, index) in navCategories"
          :key="category.title"
          class="flex flex-col gap-2 px-2 md:px-3 w-full"
        >
          <div>
            <h2
              class="text-xs md:text-sm tracking-wider text-gray-600 font-medium transition-all duration-1000"
              :class="sidebarOpen ? 'opacity-100' : 'opacity-0'"
            >
              {{ category.title }}
            </h2>
          </div>
          <div
            class="flex flex-col gap-2 self-center w-full transition-all duration-1000"
            :class="sidebarOpen ? 'translate-y-0' : '-translate-y-7'"
          >
            <NuxtLink
              v-for="link in category.links"
              :key="link.to"
              :to="link.to"
              :class="[
                'flex items-center border-1 px-2 md:px-3 rounded-lg md:rounded-xl transition-all duration-1000 ease-in-out font-medium overflow-hidden',
                sidebarOpen
                  ? 'gap-3 w-full h-8.5 md:h-11.5'
                  : 'w-8.5 md:w-11.5 h-8.5 md:h-11.5 gap-10',
                isActive(link.path || link.to)
                  ? 'bg-white border-gray-300 shadow-sm text-black'
                  : 'hover:bg-gray-200 border-transparent text-slate-700',
                link.requiresAuth
                  ? data?.user[link.requiresAuth]
                    ? ''
                    : 'pointer-events-none opacity-50'
                  : '',
              ]"
            >
              <div class="flex items-center justify-center min-w-4 md:min-w-5">
                <Icon :name="link.icon" class="text-base md:text-xl" />
              </div>
              <span
                class="text-sm md:text-base transition-all duration-700"
                :class="sidebarOpen ? 'opacity-100' : 'opacity-0'"
                >{{ link.label }}</span
              >
              <Icon
                v-if="link.requiresAuth && !data?.user[link.requiresAuth]"
                name="mdi:lock-outline"
                class="ml-auto"
              />
            </NuxtLink>
          </div>
          <Divider
            class="!my-0 !h-1"
            v-if="index !== navCategories.length - 1"
          />
        </nav>
      </div>
      <div class="bg-white rounded-2xl flex m-2 md:m-3" id="sidebar-footer">
        <div
          class="rounded-xl gap-2 flex items-center justify-between cursor-pointer flex-1 transition-all ease-in-out duration-300 overflow-auto"
          :class="sidebarOpen ? 'w-full' : 'w-8.5 md:!w-11.5'"
          v-if="status === 'authenticated'"
          @click="toggle"
        >
          <div class="flex gap-2 items-center">
            <Avatar
              :image="data.user.image"
              shape="circle"
              :pt="{
                root: 'w-8.5 min-w-8.5 md:min-w-11.5 min-h-8.5 md:min-h-11.5 max-w-8.5 md:max-w-11.5 max-h-8.5 md:max-h-11.5',
                image: {
                  class: '!rounded-xl',
                  alt: data.user.name,
                },
              }"
            />
            <Transition name="fade">
              <span
                v-if="sidebarOpen"
                class="inline-flex flex-col items-start select-none"
              >
                <span class="font-bold whitespace-nowrap">{{
                  data.user.name
                }}</span>
              </span>
            </Transition>
          </div>
          <Transition name="fade">
            <Icon
              v-if="sidebarOpen"
              name="material-symbols:expand-all-rounded"
              class="text-xl"
            />
          </Transition>
        </div>
        <Button
          label="Sign In"
          v-else
          :class="[
            '!justify-start transition-all !gap-3 duration-1000 shadow-sm rounded-xl p-2 flex items-center border-1 border-gray-200 flex-1',
            sidebarOpen ? '!w-full' : '!w-8.5 md:!w-11.5',
          ]"
          :pt="{
            label: [
              'whitespace-nowrap transition-all duration-1000',
              sidebarOpen ? '!opacity-100' : '!opacity-0',
            ],
          }"
          @click="$router.push('/auth')"
        >
          <template #icon>
            <Icon name="hugeicons:login-02" class="!text-xl min-w-5" />
          </template>
        </Button>
        <Menu
          ref="menu"
          appendTo="body"
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
    </div>
  </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar button {
  position: absolute;
}

.sidebar-open button {
  animation: slide-up 1s ease-in-out forwards;
}

.sidebar-closed button {
  animation: slide-down 1s ease-in-out forwards;
}

@keyframes slide-down {
  0% {
    bottom: 50%;
    transform: translate(0, 50%);
    right: 4px;
  }
  25% {
    bottom: 16px;
  }
  100% {
    bottom: 16px;
    right: 50%;
    transform: translate(50%, 0);
  }
}

@keyframes slide-up {
  0% {
    bottom: 16px;
    right: 50%;
    transform: translate(50%, 0);
  }
  75% {
    bottom: 16px;
  }
  100% {
    bottom: 50%;
    right: 4px;
    transform: translate(0, 50%);
  }
}
</style>
