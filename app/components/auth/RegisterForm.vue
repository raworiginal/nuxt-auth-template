<script setup lang="ts">
import { useAuthClient } from "~/composables/useAuthClient";
import { registerSchema, type RegisterFormData } from "~/utils/schemas/auth";

const { register, loading, error: authError } = useAuthClient();

const form = reactive<RegisterFormData>({
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
});

const fieldErrors = ref<Record<string, string>>({});

async function handleSubmit() {
  fieldErrors.value = {};

  const result = registerSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors.value[field]) {
        fieldErrors.value[field] = issue.message;
      }
    }
    return;
  }
  const registeredUser = await register(result.data);
  if (registeredUser) {
    await navigateTo("/app");
  }
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading">
      <legend class="fieldset-legend">Register</legend>
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>

      <UserIdentityFields
        v-model:email="form.email"
        v-model:name="form.name"
        :errors="fieldErrors"
      />

      <PasswordFields
        v-model:password="form.password"
        v-model:confirm-password="form.confirmPassword"
        :errors="fieldErrors"
      />
      <button class="btn btn-primary mt-4" type="submit" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner" />
        {{ loading ? "Registering..." : "Register" }}
      </button>
    </Fieldset>
  </form>
</template>
