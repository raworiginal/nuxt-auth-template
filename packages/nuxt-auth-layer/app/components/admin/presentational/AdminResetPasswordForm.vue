<script setup lang="ts">
import type { ResetAdminUserPasswordFormData } from "#layers/nuxt-auth-layer/app/types/admin";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: ResetAdminUserPasswordFormData];
}>();

const form = reactive<ResetAdminUserPasswordFormData>({
  newPassword: "",
  confirmPassword: "",
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="props.loading" title="Reset password">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <p v-if="props.successMessage" class="text-success mt-2" role="status">
        {{ props.successMessage }}
      </p>

      <PasswordField
        v-model:password="form.newPassword"
        :error="props.fieldErrors.newPassword"
        id="admin-reset-password-new"
        label="New password"
        name="newPassword"
      />
      <PasswordField
        v-model:password="form.confirmPassword"
        :error="props.fieldErrors.confirmPassword"
        id="admin-reset-password-confirm"
        label="Confirm password"
        name="confirmPassword"
      />

      <button class="btn btn-primary mt-4" type="submit" :disabled="props.loading">
        <span v-if="props.loading" class="loading loading-spinner" />
        {{ props.loading ? "Resetting..." : "Reset password" }}
      </button>
    </Fieldset>
  </form>
</template>
