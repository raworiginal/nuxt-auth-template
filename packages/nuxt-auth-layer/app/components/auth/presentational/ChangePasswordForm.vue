<script setup lang="ts">
import type { ChangePasswordFormData } from "#layers/nuxt-auth-layer/app/types/auth";

const {
  loading,
  error: authError,
  successMessage,
  fieldErrors,
} = defineProps<{
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: ChangePasswordFormData];
}>();

const form = reactive<ChangePasswordFormData>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading" title="Change Password">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>
      <p v-if="successMessage" class="text-success mt-2" role="status">
        {{ successMessage }}
      </p>

      <PasswordField
        v-model:password="form.currentPassword"
        :error="fieldErrors.currentPassword"
        id="current-password"
        label="Current password"
        name="currentPassword"
        autocomplete="current-password"
      />
      <PasswordField
        v-model:password="form.newPassword"
        :error="fieldErrors.newPassword"
        id="new-password"
        label="New password"
        name="newPassword"
      />
      <PasswordField
        v-model:password="form.confirmPassword"
        :error="fieldErrors.confirmPassword"
        id="confirm-new-password"
        label="Confirm new password"
        name="confirmPassword"
      />

      <button class="btn btn-primary mt-4" type="submit" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner" />
        {{ loading ? "Changing..." : "Change password" }}
      </button>
    </Fieldset>
  </form>
</template>
