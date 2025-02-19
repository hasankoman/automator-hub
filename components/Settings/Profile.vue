<script setup>
const meStore = useMeStore();
const { user } = storeToRefs(meStore);
const router = useRouter();
const toast = useToast();
const confirm = useConfirm();

const handleDeleteAccount = async (event) => {
  confirm.require({
    target: event.currentTarget,
    header: "Delete Account",
    message:
      "Are you sure you want to delete your account? Once you delete your account, there is no going back. Please be certain.",
    rejectProps: {
      label: "Cancel",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: async () => {
      try {
        await meStore.deleteAccount();
        toast.add({
          severity: "success",
          summary: "Account Deleted",
          detail: "Your account has been successfully deleted",
          life: 3000,
        });
        await meStore.signOut();
        router.push("/");
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to delete account. Please try again.",
          life: 3000,
        });
      }
    },
  });
};
</script>

<template>
  <div
    class="flex flex-col gap-3 p-4 border border-gray-200 rounded-xl shadow-md"
  >
    <h2 class="text-xl font-semibold border-b border-gray-200 pb-2">
      Profile Information
    </h2>

    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Name</span>
        <span class="font-medium">{{ user?.name }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Email</span>
        <span class="font-medium">{{ user?.email }}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-sm text-gray-500">Account Created</span>
        <span class="font-medium">{{
          new Date(user?.createdAt).toLocaleDateString()
        }}</span>
      </div>
    </div>

    <Accordion>
      <AccordionPanel
        value="0"
        :pt="{
          root: '!border-b-0 !border-t ',
        }"
      >
        <AccordionHeader
          :pt="{
            root: '!p-0 !pt-3 !shadow-none !outline-none !text-sm !text-black  !w-15',
          }"
        >
          More
        </AccordionHeader>
        <AccordionContent
          :pt="{
            content: '!p-0 !pt-1',
          }"
        >
          <Button
            severity="danger"
            label="Delete Account"
            class="hover:underline !bg-transparent !p-0 !text-sm"
            text
            @click="handleDeleteAccount"
            outlined
          />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <ConfirmPopup
      :pt="{
        root: '!rounded-xl md:w-1/3',
        content: '!gap-2',
      }"
    >
      <template #icon>
        <Icon
          class="text-5xl text-red-500"
          name="solar:shield-warning-broken"
        />
      </template>
    </ConfirmPopup>
  </div>
</template>
