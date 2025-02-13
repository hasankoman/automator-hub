<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { useLoadingStore } from "~/store/loading";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
});

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
  <div class="bg-white border border-gray-200 shadow-lg rounded-xl p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-black">Account</h2>
    </div>

    <div class="space-y-6">
      <template v-if="status !== 'authenticated'">
        <div class="space-y-4">
          <InputText
            v-model="email"
            type="email"
            placeholder="Your email"
            class="w-full p-3"
            disabled
          />

          <InputText
            v-model="password"
            type="password"
            placeholder="Your password"
            class="w-full p-3"
            disabled
          />
          <Button
            label="Login"
            @click="handleDefaultLogin"
            class="w-full"
            severity="primary"
          />
        </div>
      </template>

      <template v-else>
        <div class="flex flex-col items-center gap-4">
          <div class="relative">
            <img
              v-if="data?.user.image"
              :src="data?.user.image"
              alt="Profile Picture"
              class="w-24 h-24 rounded-full border-4 border-primary shadow-md"
            />
            <div
              v-else
              class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
            >
              <span class="text-3xl font-bold text-gray-500">{{
                name?.charAt(0)
              }}</span>
            </div>
          </div>

          <p class="text-xl font-bold">
            Welcome, {{ data?.user.name || data?.user.email }}!
          </p>

          <div class="w-full max-w-md space-y-4 mt-4">
            <div class="bg-gray-50 border-gray-200 border-1 rounded-xl p-3">
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Name</label
              >
              <div class="text-gray-900 font-medium">
                {{ name }}
              </div>
            </div>

            <div class="bg-gray-50 border-gray-200 border-1 rounded-xl p-3">
              <label class="block text-sm font-medium text-gray-600 mb-1"
                >Email</label
              >
              <div class="text-gray-900 font-medium">
                {{ email }}
              </div>
            </div>
          </div>

          <Button
            label="Sign Out"
            @click="handleLogout"
            severity="danger"
            class="mt-6"
            outlined
          />
        </div>
      </template>
    </div>
  </div>
</template>
