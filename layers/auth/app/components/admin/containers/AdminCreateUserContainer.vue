<script setup lang="ts">
import type { CreateAdminUserFormData } from "#shared/auth/types/admin";

const emit = defineEmits<{
  created: [];
}>();

const open = defineModel<boolean>("open", { required: true });

const { fieldErrors, loading, error, successMessage, submit } =
  useCreateAdminUser();

const formKey = ref(0);

watch(successMessage, (message) => {
  if (!message) return;

  formKey.value += 1;
  emit("created");
});

function handleSubmit(input: CreateAdminUserFormData) {
  return submit(input);
}
</script>

<template>
  <AppModal v-model:open="open" title="Create user" :close-disabled="loading">
    <AdminCreateUserForm
      :key="formKey"
      :field-errors="fieldErrors"
      :loading="loading"
      :error="error"
      :success-message="successMessage"
      @submit="handleSubmit"
    />
  </AppModal>
</template>
