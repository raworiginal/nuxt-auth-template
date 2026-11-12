<script setup lang="ts">
import type {
  AdminUser,
  EditAdminUserFormData,
  EditAdminUserInput,
} from "#shared/auth/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const emit = defineEmits<{
  updated: [];
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
} = useEditAdminUser();

const initialValues = computed<EditAdminUserFormData>(() => ({
  name: props.user?.name ?? "",
  email: props.user?.email ?? "",
  role: props.user?.role === "admin" ? "admin" : "user",
}));

watch(open, (isOpen) => {
  if (!isOpen) return;

  formKey.value += 1;
  clearState();
});

watch(
  () => props.user,
  (user) => {
    if (!user || !open.value) return;

    formKey.value += 1;
    clearState();
  },
);

watch(successMessage, (message) => {
  if (!message) return;

  emit("updated");
});

function handleSubmit(input: EditAdminUserFormData) {
  if (!props.user) return;

  const editInput: EditAdminUserInput = {
    userId: props.user.id,
    ...input,
  };

  return submit(editInput);
}
</script>

<template>
  <AppModal v-model:open="open" title="Edit user" :close-disabled="loading">
    <AdminEditUserForm
      v-if="props.user"
      :key="formKey"
      :initial-values="initialValues"
      :field-errors="fieldErrors"
      :loading="loading"
      :error="error"
      :success-message="successMessage"
      @submit="handleSubmit"
    />
  </AppModal>
</template>
