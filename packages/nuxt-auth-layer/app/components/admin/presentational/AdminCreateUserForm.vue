<script setup lang="ts">
import type { CreateAdminUserFormData } from "#layers/nuxt-auth-layer/app/types/admin";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: CreateAdminUserFormData];
}>();

const form = reactive<CreateAdminUserFormData>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="props.loading" title="Create user">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <p v-if="props.successMessage" class="text-success mt-2" role="status">
        {{ props.successMessage }}
      </p>

      <label class="label mt-2" for="admin-create-user-name">Name</label>
      <input
        id="admin-create-user-name"
        v-model="form.name"
        class="input"
        name="name"
        type="text"
        autocomplete="name"
        :aria-invalid="Boolean(props.fieldErrors.name)"
        aria-describedby="admin-create-user-name-error"
      />
      <p
        v-if="props.fieldErrors.name"
        id="admin-create-user-name-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.name }}
      </p>

      <label class="label mt-2" for="admin-create-user-email">Email</label>
      <input
        id="admin-create-user-email"
        v-model="form.email"
        class="input"
        name="email"
        type="email"
        autocomplete="email"
        :aria-invalid="Boolean(props.fieldErrors.email)"
        aria-describedby="admin-create-user-email-error"
      />
      <p
        v-if="props.fieldErrors.email"
        id="admin-create-user-email-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.email }}
      </p>

      <PasswordField
        v-model:password="form.password"
        :error="props.fieldErrors.password"
        id="admin-create-user-password"
        label="Password"
        name="password"
      />
      <PasswordField
        v-model:password="form.confirmPassword"
        :error="props.fieldErrors.confirmPassword"
        id="admin-create-user-confirm-password"
        label="Confirm password"
        name="confirmPassword"
      />

      <label class="label mt-2" for="admin-create-user-role">Role</label>
      <select
        id="admin-create-user-role"
        v-model="form.role"
        class="select"
        name="role"
        :aria-invalid="Boolean(props.fieldErrors.role)"
        aria-describedby="admin-create-user-role-error"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <p
        v-if="props.fieldErrors.role"
        id="admin-create-user-role-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.role }}
      </p>

      <button class="btn btn-primary mt-4" type="submit" :disabled="props.loading">
        <span v-if="props.loading" class="loading loading-spinner" />
        {{ props.loading ? "Creating..." : "Create user" }}
      </button>
    </Fieldset>
  </form>
</template>
