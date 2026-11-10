<script setup lang="ts">
import type { EditAdminUserFormData } from "#layers/nuxt-auth-layer/app/types/admin";

const props = defineProps<{
  initialValues: EditAdminUserFormData;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: EditAdminUserFormData];
}>();

const form = reactive<EditAdminUserFormData>({ ...props.initialValues });

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="props.loading" title="Edit user">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <p v-if="props.successMessage" class="text-success mt-2" role="status">
        {{ props.successMessage }}
      </p>

      <label class="label mt-2" for="admin-edit-user-name">Name</label>
      <input
        id="admin-edit-user-name"
        v-model="form.name"
        class="input"
        name="name"
        type="text"
        autocomplete="name"
        :aria-invalid="Boolean(props.fieldErrors.name)"
        aria-describedby="admin-edit-user-name-error"
      />
      <p
        v-if="props.fieldErrors.name"
        id="admin-edit-user-name-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.name }}
      </p>

      <label class="label mt-2" for="admin-edit-user-email">Email</label>
      <input
        id="admin-edit-user-email"
        v-model="form.email"
        class="input"
        name="email"
        type="email"
        autocomplete="email"
        :aria-invalid="Boolean(props.fieldErrors.email)"
        aria-describedby="admin-edit-user-email-error"
      />
      <p
        v-if="props.fieldErrors.email"
        id="admin-edit-user-email-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.email }}
      </p>

      <label class="label mt-2" for="admin-edit-user-role">Role</label>
      <select
        id="admin-edit-user-role"
        v-model="form.role"
        class="select"
        name="role"
        :aria-invalid="Boolean(props.fieldErrors.role)"
        aria-describedby="admin-edit-user-role-error"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <p
        v-if="props.fieldErrors.role"
        id="admin-edit-user-role-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.role }}
      </p>

      <button class="btn btn-primary mt-4" type="submit" :disabled="props.loading">
        <span v-if="props.loading" class="loading loading-spinner" />
        {{ props.loading ? "Saving..." : "Save changes" }}
      </button>
    </Fieldset>
  </form>
</template>
