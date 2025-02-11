<script setup>
import { useRoute } from "vue-router";
import { useSidebarStore } from "~/store/sidebar";

const { data } = useAuth();
const route = useRoute();
const sidebarStore = useSidebarStore();
const { open: sidebarOpen } = storeToRefs(sidebarStore);

const isActive = (path) => route.path === path;
</script>

<template>
  <aside
    class="h-screen text-black p-5 flex flex-col z-50 bg-white md:bg-transparent w-72 fixed left-0 top-0 shadow-2xl md:shadow-none transition-all duration-300"
    :class="!sidebarOpen ? '-translate-x-100' : 'translate-x-0'"
  >
    <div class="mb-8">
      <h1 class="text-xl font-semibold">AUTOMATION MANAGER</h1>
    </div>

    <nav class="space-y-1 mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        GITHUB
      </h2>
      <NuxtLink
        to="/github"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out group',
          isActive('/github')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
          data?.user.github ? '' : 'pointer-events-none opacity-50',
        ]"
      >
        <Icon name="hugeicons:ease-curve-control-points" class="mr-3" />
        <span>Repositories</span>
        <Icon
          name="mdi:lock-outline"
          class="ml-auto"
          v-if="!data?.user.github"
        />
      </NuxtLink>
    </nav>

    <nav class="space-y-1 mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        E-MAIL
      </h2>
      <NuxtLink
        to="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out group',
          isActive('/email')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
          data?.user.emails ? '' : 'pointer-events-none opacity-50',
        ]"
      >
        <Icon name="hugeicons:mail-02" class="mr-3" />
        <span>Email</span>
        <Icon
          name="mdi:lock-outline"
          class="ml-auto"
          v-if="!data?.user.emails"
        />
      </NuxtLink>
    </nav>

    <nav class="space-y-1">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        ACCOUNT
      </h2>
      <NuxtLink
        to="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/general')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="hugeicons:settings-01" class="mr-3" />
        <span>General</span>
      </NuxtLink>
      <NuxtLink
        to="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/security')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="hugeicons:shield-01" class="mr-3" />
        <span>Security</span>
      </NuxtLink>
      <NuxtLink
        to="/integrations"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/integrations')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="hugeicons:plug-socket" class="mr-3" />
        <span>Integrations</span>
      </NuxtLink>
      <NuxtLink
        to="/account"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="hugeicons:user" class="mr-3" />
        <span>Account</span>
      </NuxtLink>
      <NuxtLink
        to="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/notifications')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="hugeicons:notification-03" class="mr-3" />
        <span>Notifications</span>
      </NuxtLink>
    </nav>
  </aside>
</template>
