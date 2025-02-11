<template>
  <div class="flex flex-col gap-3 w-full">
    <Header />
    <div
      class="flex flex-col gap-5 p-5 bg-white rounded-2xl overflow-auto border-t-1 border-x-1 border-gray-200 shadow-inner"
    >
      <template v-if="data">
        <div
          class="p-4 bg-white rounded-xl shadow-xs flex items-center justify-between gap-3 col-span-1 border-1 transition-all ease-linear border-gray-200 duration-200 relative cursor-pointer"
        >
          <div class="flex gap-3 items-center">
            <div
              class="border-1 border-gray-100 rounded-lg w-10 h-10 flex items-center justify-center shadow-inner"
            >
              <Icon name="mdi:github" class="text-3xl" />
            </div>
            <span>Github</span>
          </div>

          <Button
            label="Bağlantıyı çöz"
            v-if="data?.user.github"
            @click="signOut('github')"
          />
          <Button label="Bağla" v-else @click="signIn('github')" />
        </div>
      </template>
      <template v-else>
        Öncelikle Uygulamaya Giriş Yapmalısınız.
        <NuxtLink to="/account">Giriş Yap</NuxtLink>
      </template>
    </div>
    {{ status }}
    {{ data }}
    {{ useRuntimeConfig().public.webhookUrl }}
    {{ useRuntimeConfig().public }}
  </div>
</template>

<script setup>
import { ref } from "vue";

const { status, signIn, signOut, data } = useAuth();

const user = ref({
  email: "ornek@mail.com",
  password: "********", // Gerçek şifre asla bu şekilde gösterilmez.
});
</script>

<style scoped>
/* İsteğe bağlı ek stil düzenlemeleri yapılabilir */
</style>
