<script setup lang="ts">
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui";
import type { LoginFormData, SocialProvider } from "#shared/auth/types/auth";
import { loginSchema } from "#shared/auth/schemas/auth";

const props = defineProps<{
  authMode: string;
  loading: boolean;
  error: string | null;
  socialProviders: SocialProvider[];
  socialLoading: boolean;
  socialError: string | null;
}>();

const emit = defineEmits<{
  submit: [input: LoginFormData];
  socialSignIn: [provider: SocialProvider];
}>();

const fields = computed<AuthFormField[]>(() =>
  props.authMode === "social-only"
    ? []
    : [
        {
          name: "email",
          type: "email",
          label: "Email",
          placeholder: "Email",
          autocomplete: "email",
          defaultValue: "",
          required: true,
        },
        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "Password",
          autocomplete: "current-password",
          defaultValue: "",
          required: true,
        },
      ],
);

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

function handleSubmit(event: FormSubmitEvent<LoginFormData>) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UPageCard v-if="props.authMode === 'social-only'">
    <div class="space-y-2 text-center">
      <h1 class="text-xl font-semibold">Login</h1>
      <p class="text-sm text-muted">
        Sign in or create an account with a social provider.
      </p>
    </div>
    <div class="mt-6 space-y-3">
      <UButton
        v-for="provider in props.socialProviders"
        :key="provider"
        block
        color="neutral"
        variant="outline"
        :loading="props.socialLoading"
        :disabled="props.loading || props.socialLoading"
        @click="emit('socialSignIn', provider)"
      >
        {{
          props.socialLoading
            ? "Connecting…"
            : `Continue with ${provider === "google" ? "Google" : "GitHub"}`
        }}
      </UButton>
    </div>
    <div
      v-if="props.error || props.socialError"
      class="mt-4 space-y-2"
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
  </UPageCard>
  <UPageCard v-else>
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
