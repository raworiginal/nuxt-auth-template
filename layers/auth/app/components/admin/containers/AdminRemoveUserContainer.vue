<script setup lang="ts">
import type { AdminUser } from "#shared/auth/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const emit = defineEmits<{
  removed: [];
}>();

const open = defineModel<boolean>("open", { required: true });
const { fieldErrors, loading, error, clearState, remove } =
  useRemoveAdminUser();
const toast = useToast();

const title = "Remove user";

watch(open, (isOpen) => {
  if (isOpen) clearState();
  else clearState();
});

watch(
  () => props.user?.id,
  () => clearState(),
);

async function handleConfirm() {
  if (!props.user) return;

  const removed = await remove({ userId: props.user.id });
  if (removed) {
    toast.add({ title: "User removed successfully.", color: "success" });
    emit("removed");
    open.value = false;
  }
}
</script>

<template>
  <AppModal v-model:open="open" :title="title" :close-disabled="loading">
    <div v-if="props.user">
      <p>Remove this user?</p>
      <p class="mt-2">This action cannot be undone.</p>

      <p v-if="error" class="text-error mt-2" role="alert">{{ error }}</p>
      <p v-if="fieldErrors.userId" class="text-error mt-2" role="alert">
        {{ fieldErrors.userId }}
      </p>
      <UButton
        class="mt-4"
        color="error"
        type="button"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ loading ? "Removing..." : "Remove user" }}
      </UButton>
    </div>
  </AppModal>
</template>
