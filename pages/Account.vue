<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-6 text-center">Hesap Bilgilerim</h1>

      <!-- Kullanıcı Email Bilgisi -->
      <div class="mb-4">
        <label for="email" class="block text-gray-700 mb-1">Email</label>
        <input
          id="email"
          type="email"
          v-model="user.email"
          disabled
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 focus:outline-none"
        />
      </div>

      <!-- Kullanıcı Şifre Bilgisi -->
      <div class="mb-6">
        <label for="password" class="block text-gray-700 mb-1">Şifre</label>
        <input
          id="password"
          type="password"
          v-model="user.password"
          disabled
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 focus:outline-none"
        />
      </div>

      <!-- GitHub Bağlantı Butonu -->
      <div class="flex justify-center">
        <button
          @click="connectGitHub"
          class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          GitHub ile Bağlan
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Örnek kullanıcı verisi; gerçek uygulamada bu veriler bir API veya global state (store) üzerinden alınabilir.
const user = ref({
  email: "ornek@mail.com",
  password: "********", // Gerçek şifre asla bu şekilde gösterilmez.
});

// GitHub OAuth veya benzeri bir akışı başlatacak metot
const connectGitHub = () => {
  alert("GitHub hesabınız bağlanıyor...");
  // Örneğin: this.$router.push('/github-oauth') gibi yönlendirmeler yapılabilir.
};
</script>

<style scoped>
/* İsteğe bağlı ek stil düzenlemeleri yapılabilir */
</style>
