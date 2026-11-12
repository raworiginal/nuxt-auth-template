<script setup lang="ts">
import type {
  AdminUser,
  ResetAdminUserPasswordFormData,
} from "#shared/auth/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const emit = defineEmits<{
  reset: [];
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
} = useResetAdminUserPassword();

const title = computed(() =>
  props.user ? `Reset password for ${props.user.name}` : "Reset password",
);

watch(open, (isOpen) => {
  if (!isOpen) return;

  formKey.value += 1;
  clearState();
});

watch(successMessage, (message) => {
  if (!message) return;

  formKey.value += 1;
  emit("reset");
});

function handleSubmit(input: ResetAdminUserPasswordFormData) {
  if (!props.user) return;

  return submit({
    userId: props.user.id,
    ...input,
  });
}
</script>

<template>
  <AppModal v-model:open="open" :title="title" :close-disabled="loading">
    <AdminResetPasswordForm
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
