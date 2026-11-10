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
      <label class="label">Email</label>
      <input
        v-model="form.email"
        type="email"
        class="input"
        placeholder="Email"
        required
      />
      <p
        v-if="fieldErrors.email"
        id="email-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.email }}
      </p>

      <PasswordField
        v-model:password="form.password"
        :error="fieldErrors.password"
        autocomplete="current-password"
      />

      <button class="btn btn-primary mt-4">Login</button>

      <template v-if="socialProviders.length > 0">
        <div class="divider">or continue with</div>
        <p v-if="socialError" class="text-error text-sm" role="alert">
          {{ socialError }}
        </p>
        <button
          v-for="provider in socialProviders"
          :key="provider"
          type="button"
          class="btn btn-outline mt-2"
          :disabled="loading || socialLoading"
          @click="emit('socialSignIn', provider)"
        >
          {{ socialLoading ? "Connecting…" : `Continue with ${getProviderLabel(provider)}` }}
        </button>
      </template>
    </Fieldset>
  </form>
</template>
