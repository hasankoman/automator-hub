<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path) => route.path === path;
</script>

<template>
  <aside class="min-w-72 h-screen rounded-2xl text-black p-5 flex flex-col">
    <div class="mb-8">
      <h1 class="text-xl font-semibold">AUTOMATION MANAGER</h1>
    </div>

    <nav class="space-y-1 mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        GITHUB
      </h2>
      <a
        href="/github"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out group',
          isActive('/github')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:source-repository" class="mr-3" />
        <span>Repositories</span>
      </a>
    </nav>

    <nav class="space-y-1 mb-8">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        E-MAIL
      </h2>
      <a
        href="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out group',
          isActive('/email')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:email" class="mr-3" />
        <span>Email</span>
      </a>
    </nav>

    <nav class="space-y-1">
      <h2 class="text-xs uppercase tracking-wider text-gray-400 mb-3">
        ACCOUNT
      </h2>
      <a
        href="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/general')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:cog" class="mr-3" />
        <span>General</span>
      </a>
      <a
        href="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/security')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:shield-lock" class="mr-3" />
        <span>Security</span>
      </a>
      <a
        href="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/integrations')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:integration" class="mr-3" />
        <span>Integrations</span>
      </a>
      <a
        href="/account"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:account" class="mr-3" />
        <span>Account</span>
      </a>
      <a
        href="#"
        :class="[
          'flex items-center px-3 py-2 rounded-lg transition-all duration-100 ease-in-out',
          isActive('/account/notifications')
            ? 'bg-gray-300 font-semibold'
            : 'hover:bg-gray-200',
        ]"
      >
        <Icon name="mdi:bell" class="mr-3" />
        <span>Notifications</span>
      </a>
    </nav>
  </aside>
</template>
