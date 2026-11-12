<script setup lang="ts">
import type { CreateAdminUserFormData } from "#shared/auth/types/admin";

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

      <UFormField
        label="Name"
        name="name"
        :error="props.fieldErrors.name"
      >
        <UInput
          id="admin-create-user-name"
          v-model="form.name"
          name="name"
          autocomplete="name"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Email"
        name="email"
        :error="props.fieldErrors.email"
      >
        <UInput
          id="admin-create-user-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

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

      <UFormField label="Role" name="role" :error="props.fieldErrors.role">
        <USelect
          id="admin-create-user-role"
          v-model="form.role"
          name="role"
          :items="[
            { label: 'User', value: 'user' },
            { label: 'Admin', value: 'admin' },
          ]"
          class="w-full"
        />
      </UFormField>

      <UButton class="mt-4" type="submit" :loading="props.loading">
        {{ props.loading ? "Creating..." : "Create user" }}
      </UButton>
    </Fieldset>
  </form>
</template>
