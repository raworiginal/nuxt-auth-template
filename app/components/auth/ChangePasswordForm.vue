<script setup lang="ts">
import {
  passwordChangeSchema,
  type ChangePasswordFormData,
} from "~/utils/schemas/auth";

const { changePassword, loading, error: authError } = useAuthClient();

const form = reactive<ChangePasswordFormData>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const fieldErrors = ref<Record<string, string>>({});
const successMessage = ref<string | null>(null);

async function handleSubmit() {
  fieldErrors.value = {};
  successMessage.value = null;

  const result = passwordChangeSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string" && !fieldErrors.value[field]) {
        fieldErrors.value[field] = issue.message;
      }
    }

    return;
  }

  const changedPassword = await changePassword({
    currentPassword: result.data.currentPassword,
    newPassword: result.data.newPassword,
  });

  if (!changedPassword) return;

  form.currentPassword = "";
  form.newPassword = "";
  form.confirmPassword = "";
  successMessage.value = "Password changed successfully.";
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
