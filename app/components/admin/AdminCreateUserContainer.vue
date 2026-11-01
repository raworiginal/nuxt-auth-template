<script setup lang="ts">
import type { CreateAdminUserFormData } from "~/types/admin";

const emit = defineEmits<{
  created: [];
}>();

const { fieldErrors, loading, error, successMessage, submit } =
  useCreateAdminUser();

const open = ref(false);
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
  <button class="btn btn-primary" type="button" @click="open = true">
    Create user
  </button>

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
