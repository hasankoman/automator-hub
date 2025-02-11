<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useLoadingStore } from "~/store/loading";

const { status, signIn, signOut, data } = useAuth();
const toast = useToast();
const loadingStore = useLoadingStore();

const email = ref("test@gmail.com");
const password = ref("1234");

const handleDefaultLogin = async () => {
  try {
    loadingStore.startLoading();

    const response = await signIn("credentials", {
      email: email.value,
      password: password.value,
      redirect: false,
    });

    if (response?.error) {
      throw new Error(response.error);
    }

    if (!response?.ok) {
      throw new Error("Login failed");
    }

    toast.add({
      severity: "success",
      summary: "Process Successful",
      detail: "Successfully Logged In",
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Login Error",
      detail:
        error instanceof Error ? error.message : "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    loadingStore.stopLoading();
  }
};

const handleLogout = async () => {
  try {
    loadingStore.startLoading();

    const response = await signOut({
      redirect: false,
    });

    if (response?.error) {
      throw new Error(response.error);
    }

    toast.add({
      severity: "success",
      summary: "Process Successful",
      detail: "Successfully Logged Out",
      life: 3000,
    });
  } catch (error) {
    console.error(error);
    toast.add({
      severity: "error",
      summary: "Logout Error",
      detail:
        error instanceof Error ? error.message : "An unexpected error occurred",
      life: 3000,
    });
  } finally {
    loadingStore.stopLoading();
  }
};
</script>

<template>
  <div class="flex flex-col gap-3 w-full overflow-hidden">
    <Header />

    <div
      class="grid grid-cols-1 gap-5 p-5 bg-white rounded-2xl overflow-auto border-1 border-gray-200 shadow-inner"
    >
      <template v-if="status !== 'authenticated'">
        <InputText
          v-model="email"
          type="email"
          placeholder="Email adresiniz"
          disabled
        />

        <InputText
          v-model="password"
          type="password"
          placeholder="Şifreniz"
          disabled
        />
        <Button label="Login" @click="handleDefaultLogin" />
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-3">
          <p class="text-lg font-semibold">
            Hoş geldiniz, {{ data?.user.name || data?.user.email }}!
          </p>
          <img
            :src="data?.user.image"
            alt="Profil Resmi"
            class="w-16 h-16 rounded-full"
            v-if="data?.user.image"
          />
          <Button label="Çıkış Yap" @click="handleLogout" severity="danger" />
        </div>
      </template>
    </div>
  </div>
</template>
