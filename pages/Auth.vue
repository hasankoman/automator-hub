<script setup>
definePageMeta({
  layout: "auth",
  middleware: "auth",
  isAuthPage: true,
});

const { signIn } = useAuth();
</script>
<template>
  <div
    class="bg-white rounded-2xl p-4 flex flex-col gap-3 items-center justify-center w-11/12 md:w-1/3 xl:w-1/4 text-center"
  >
    <span> Currently, you can only sign in with your GitHub account. </span>
    <Button
      label="Sign In with Github"
      class="shadow-sm rounded-xl w-full p-2 gap-2 flex items-center border-1 border-gray-200 cursor-pointer flex-1"
      @click="signIn('github')"
    >
      <template #icon>
        <Icon name="hugeicons:github" />
      </template>
    </Button>
  </div>
</template>

<style></style>
