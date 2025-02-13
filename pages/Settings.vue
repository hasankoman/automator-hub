<script setup>
const { data: session } = useAuth();

const usageStats = {
  premiumRequests: 2,
  premiumLimit: 50,
  monthlyRequests: 0,
  monthlyLimit: 200,
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <Header />

    <div
      class="flex flex-col gap-5 p-5 bg-white rounded-2xl overflow-auto border border-gray-200 shadow-inner"
    >
      <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold m-0">Settings</h1>
        <p class="text-gray-500">
          You can manage your account, usage and subscription settings here.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="flex flex-col gap-6">
          <SettingsAccount
            :name="session?.user?.name || 'Unknown User'"
            :email="session?.user?.email"
            :image="session?.user?.image"
          />
          <SettingsSubscription v-if="false" />
        </div>

        <SettingsUsage v-bind="usageStats" v-if="false" />
      </div>
    </div>
  </div>
</template>
