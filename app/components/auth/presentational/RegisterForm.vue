<script setup lang="ts">
import type { AuthFormField } from "@nuxt/ui";
import type { RegisterFormData } from "#shared/auth/types/auth";
import { registerSchema } from "#shared/auth/schemas/auth";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: RegisterFormData];
}>();

const fields = computed<AuthFormField[]>(() => [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Email",
    autocomplete: "email",
    defaultValue: "",
    required: true,
    error: props.fieldErrors.email,
  },
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Name",
    autocomplete: "name",
    defaultValue: "",
    required: true,
    error: props.fieldErrors.name,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    autocomplete: "new-password",
    defaultValue: "",
    required: true,
    error: props.fieldErrors.password,
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm password",
    placeholder: "Confirm password",
    autocomplete: "new-password",
    defaultValue: "",
    required: true,
    error: props.fieldErrors.confirmPassword,
  },
]);

function handleSubmit(event: { data: RegisterFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UCard>
    <UAuthForm
      title="Register"
      :fields="fields"
      :schema="registerSchema"
      :disabled="loading"
      :loading="loading"
      :submit="{ label: loading ? 'Registering…' : 'Register', block: true }"
      @submit="handleSubmit"
    >
      <template #validation>
        <UAlert
          v-if="props.error"
          color="error"
          variant="subtle"
          role="alert"
          :description="props.error"
        />
      </template>
    </UAuthForm>
  </UCard>
</template>
