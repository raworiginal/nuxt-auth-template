<script setup lang="ts">
import { loginSchema, type LoginSchemaFormData } from "~/utils/schemas/auth";
const { login, loading, error: authError } = useAuthClient();

const form = reactive<LoginSchemaFormData>({
  email: "",
  password: "",
});

const fieldErrors = ref<Record<string, string>>({});

async function handleSubmit() {
  fieldErrors.value = {};

  const result = loginSchema.safeParse(form);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors.value[field]) {
        fieldErrors.value[field] = issue.message;
      }
    }
    return;
  }
  const loggedInUser = await login(result.data);
  if (loggedInUser) {
    await navigateTo("/app");
  }
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading">
      <legend class="fieldset-legend">Login</legend>

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

      <label class="label">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="input"
        placeholder="Password"
        required
      />
      <p
        v-if="fieldErrors.password"
        id="password-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.password }}
      </p>

      <button class="btn btn-primary mt-4">Login</button>
    </Fieldset>
  </form>
</template>
