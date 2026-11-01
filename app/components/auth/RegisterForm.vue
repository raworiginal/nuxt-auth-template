<script setup lang="ts">
import type { RegisterFormData } from "~/types/auth";

const {
  loading,
  error: authError,
  fieldErrors,
} = defineProps<{
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: RegisterFormData];
}>();

const form = reactive<RegisterFormData>({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading" title="Register">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>

      <UserIdentityFields
        v-model:email="form.email"
        v-model:name="form.name"
        :errors="fieldErrors"
      />

      <PasswordField
        v-model:password="form.password"
        :error="fieldErrors.password"
      />
      <PasswordField
        v-model:password="form.confirmPassword"
        :error="fieldErrors.confirmPassword"
        id="confirm-password"
        placeholder="Confirm Password"
        label="Confirm Password"
        name="confirmPassword"
      />
      <button class="btn btn-primary mt-4" type="submit" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner" />
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </Fieldset>
  </form>
</template>
