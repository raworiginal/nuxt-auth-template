<script setup lang="ts">
import type { RegisterFormData } from "#shared/auth/types/auth";
import { registerSchema } from "#shared/auth/schemas/auth";

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

function handleSubmit(event: { data: RegisterFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UForm :schema="registerSchema" :state="form" @submit="handleSubmit">
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
      <UButton class="mt-4" type="submit" :loading="loading">
        {{ loading ? "Registering..." : "Register" }}
      </UButton>
    </Fieldset>
  </UForm>
</template>
