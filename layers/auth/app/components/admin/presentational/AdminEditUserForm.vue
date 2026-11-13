<script setup lang="ts">
import type { EditAdminUserFormData } from "#shared/auth/types/admin";
import { editAdminUserSchema } from "#shared/auth/schemas/admin";

const formSchema = editAdminUserSchema.omit({ userId: true });

const props = defineProps<{
  initialValues: EditAdminUserFormData;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: EditAdminUserFormData];
}>();

const form = reactive<EditAdminUserFormData>({ ...props.initialValues });

function handleSubmit(event: { data: EditAdminUserFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UForm :schema="formSchema" :state="form" @submit="handleSubmit">
    <Fieldset :disabled="props.loading" title="Edit user">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <UFormField label="Name" name="name" :error="props.fieldErrors.name">
        <UInput
          id="admin-edit-user-name"
          v-model="form.name"
          name="name"
          autocomplete="name"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Email" name="email" :error="props.fieldErrors.email">
        <UInput
          id="admin-edit-user-email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Role" name="role" :error="props.fieldErrors.role">
        <USelect
          id="admin-edit-user-role"
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
        {{ props.loading ? "Saving..." : "Save changes" }}
      </UButton>
    </Fieldset>
  </UForm>
</template>
