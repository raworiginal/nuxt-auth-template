<script setup lang="ts">
import {
  passwordChangeSchema,
  type PasswordChangeFormData,
} from "~/utils/schemas/auth";

const emit = defineEmits<{
  success: [];
}>();

const { changePassword, loading, error: authError } = useAuthClient();

const form = reactive<PasswordChangeFormData>({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const fieldErrors = ref<Record<string, string>>({});

async function handleSubmit() {
  fieldErrors.value = {};

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
  emit("success");
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>

      <label class="label" for="current-password">Current password</label>
      <input
        id="current-password"
        v-model="form.currentPassword"
        name="currentPassword"
        type="password"
        class="input w-full"
        autocomplete="current-password"
        :aria-invalid="Boolean(fieldErrors.currentPassword)"
        aria-describedby="current-password-error"
      />
      <p
        v-if="fieldErrors.currentPassword"
        id="current-password-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.currentPassword }}
      </p>

      <label class="label mt-2" for="new-password">New password</label>
      <input
        id="new-password"
        v-model="form.newPassword"
        name="newPassword"
        type="password"
        class="input w-full"
        autocomplete="new-password"
        :aria-invalid="Boolean(fieldErrors.newPassword)"
        aria-describedby="new-password-error"
      />
      <p
        v-if="fieldErrors.newPassword"
        id="new-password-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.newPassword }}
      </p>

      <label class="label mt-2" for="confirm-new-password">
        Confirm new password
      </label>
      <input
        id="confirm-new-password"
        v-model="form.confirmPassword"
        name="confirmPassword"
        type="password"
        class="input w-full"
        autocomplete="new-password"
        :aria-invalid="Boolean(fieldErrors.confirmPassword)"
        aria-describedby="confirm-new-password-error"
      />
      <p
        v-if="fieldErrors.confirmPassword"
        id="confirm-new-password-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.confirmPassword }}
      </p>

      <button class="btn btn-primary mt-4" type="submit" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner" />
        {{ loading ? "Changing..." : "Change password" }}
      </button>
    </Fieldset>
  </form>
</template>
