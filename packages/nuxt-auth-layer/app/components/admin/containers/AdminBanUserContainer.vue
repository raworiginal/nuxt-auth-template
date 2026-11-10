<script setup lang="ts">
import type { AdminUser, BanAdminUserFormData } from "#layers/nuxt-auth-layer/app/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const emit = defineEmits<{
  banned: [];
}>();

const open = defineModel<boolean>("open", { required: true });
const formKey = ref(0);
const {
  fieldErrors,
  loading,
  error,
  successMessage,
  clearState,
  submit,
} = useBanAdminUser();

const title = computed(() =>
  props.user ? `Ban ${props.user.name}` : "Ban user",
);

watch(open, (isOpen) => {
  if (isOpen) {
    formKey.value += 1;
    clearState();
  }
});

watch(successMessage, (message) => {
  if (message) emit("banned");
});

function handleSubmit(input: BanAdminUserFormData) {
  if (!props.user) return;
  return submit({ userId: props.user.id, ...input });
}
</script>

<template>
  <AppModal v-model:open="open" :title="title" :close-disabled="loading">
    <AdminBanUserForm
      v-if="props.user"
      :key="formKey"
      :field-errors="fieldErrors"
      :loading="loading"
      :error="error"
      :success-message="successMessage"
      @submit="handleSubmit"
    />
  </AppModal>
</template>
