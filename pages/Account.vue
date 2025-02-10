<template>
  <div>
    <!-- Varsayılan Giriş Formu -->
    <form @submit.prevent="handleDefaultLogin">
      <input v-model="email" type="email" disabled placeholder="Email" />
      <input v-model="password" type="password" disabled placeholder="Şifre" />
      <button type="submit">Giriş Yap</button>
    </form>

    <!-- GitHub Girişi Butonu -->
    <button @click="handleGithubLogin">GitHub ile Giriş Yap</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { status, signIn, signOut, data } = useAuth();

const email = ref("test@gmail.com");
const password = ref("1234");

const handleDefaultLogin = async () => {
  const result = await signIn("credentials", {
    email: email.value,
    password: password.value,
  });
  // Giriş başarılı veya hatalı durumlarda gerekli yönlendirme/işlem
};

const handleGithubLogin = () => {
  signIn("github");
};
</script>
