<script setup lang="ts">
import type {
  LoginFormData,
  SocialProvider,
} from "#layers/nuxt-auth-layer/app/types/auth";

const {
  loading,
  error: authError,
  fieldErrors,
  socialProviders,
  socialLoading,
  socialError,
} = defineProps<{
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

const form = reactive<LoginFormData>({
  email: "",
  password: "",
});

function handleSubmit() {
  emit("submit", { ...form });
}

function getProviderLabel(provider: SocialProvider) {
  return provider === "google" ? "Google" : "GitHub";
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading || socialLoading" title="Login">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>
      <UFormField label="Email" name="email" :error="fieldErrors.email">
        <UInput
          v-model="form.email"
          name="email"
          type="email"
          placeholder="Email"
          autocomplete="email"
          required
          class="w-full"
        />
      </UFormField>

      <PasswordField
        v-model:password="form.password"
        :error="fieldErrors.password"
        autocomplete="current-password"
      />

      <UButton class="mt-4" type="submit">Login</UButton>

      <template v-if="socialProviders.length > 0">
        <div class="flex items-center gap-3 text-sm text-muted">
          <span class="flex-1 border-t border-default"></span>
          <span>or continue with</span>
          <span class="flex-1 border-t border-default"></span>
        </div>
        <p v-if="socialError" class="text-error text-sm" role="alert">
          {{ socialError }}
        </p>
        <UButton
          v-for="provider in socialProviders"
          :key="provider"
          type="button"
          class="mt-2"
          color="neutral"
          variant="outline"
          :disabled="loading || socialLoading"
          @click="emit('socialSignIn', provider)"
        >
          {{ socialLoading ? "Connecting…" : `Continue with ${getProviderLabel(provider)}` }}
        </UButton>
      </template>
    </Fieldset>
  </form>
</template>
