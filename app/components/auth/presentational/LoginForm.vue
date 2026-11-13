<script setup lang="ts">
import type { AuthFormField, ButtonProps } from "@nuxt/ui";
import type { LoginFormData, SocialProvider } from "#shared/auth/types/auth";
import { loginSchema } from "#shared/auth/schemas/auth";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  socialProviders: SocialProvider[];
  socialLoading: boolean;
  socialError: string | null;
}>();

const emit = defineEmits<{
  submit: [input: LoginFormData];
  socialSignIn: [provider: SocialProvider];
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
    name: "password",
    type: "password",
    label: "Password",
    placeholder: "Password",
    autocomplete: "current-password",
    defaultValue: "",
    required: true,
    error: props.fieldErrors.password,
  },
]);

const providers = computed<ButtonProps[]>(() =>
  props.socialProviders.map((provider) => ({
    label: props.socialLoading
      ? "Connecting…"
      : `Continue with ${provider === "google" ? "Google" : "GitHub"}`,
    color: "neutral",
    variant: "outline",
    disabled: props.loading || props.socialLoading,
    loading: props.socialLoading,
    onClick: () => emit("socialSignIn", provider),
  })),
);

function handleSubmit(event: { data: LoginFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UPageCard>
    <UAuthForm
      title="Login"
      :fields="fields"
      :providers="providers"
      :schema="loginSchema"
      separator="or continue with"
      :disabled="loading || socialLoading"
      :loading="loading"
      :submit="{ label: loading ? 'Signing in…' : 'Login', block: true }"
      @submit="handleSubmit"
    >
      <template #validation>
        <div
          v-if="props.error || props.socialError"
          class="space-y-2"
          role="alert"
        >
          <UAlert
            v-if="props.error"
            color="error"
            variant="subtle"
            :description="props.error"
          />
          <UAlert
            v-if="props.socialError"
            color="error"
            variant="subtle"
            :description="props.socialError"
          />
        </div>
      </template>
    </UAuthForm>
  </UPageCard>
</template>
