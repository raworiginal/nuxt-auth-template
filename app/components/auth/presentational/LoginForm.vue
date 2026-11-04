<script setup lang="ts">
import type { LoginFormData } from "~/types/auth";

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
  submit: [input: LoginFormData];
}>();

const form = reactive<LoginFormData>({
  email: "",
  password: "",
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading" title="Login">
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
    </Fieldset>
  </form>
</template>
