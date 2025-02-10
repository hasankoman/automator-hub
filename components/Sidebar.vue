<script setup></script>

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
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out group"
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
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out group"
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
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:cog" class="mr-3" />
        <span>General</span>
      </a>
      <a
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:shield-lock" class="mr-3" />
        <span>Security</span>
      </a>
      <a
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:key" class="mr-3" />
        <span>Licenses</span>
      </a>
      <a
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:integration" class="mr-3" />
        <span>Integrations</span>
      </a>
      <a
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:account" class="mr-3" />
        <span>Account</span>
      </a>
      <a
        href="#"
        class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-200 transition-all duration-100 ease-in-out"
      >
        <Icon name="mdi:bell" class="mr-3" />
        <span>Notifications</span>
      </a>
    </nav>
  </aside>
</template>
