<script setup lang="ts">
import type { ResetAdminUserPasswordFormData } from "#shared/auth/types/admin";
import { resetAdminUserPasswordSchema } from "#shared/auth/schemas/admin";

const formSchema = resetAdminUserPasswordSchema.omit({ userId: true });

const props = defineProps<{
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: ResetAdminUserPasswordFormData];
}>();

const form = reactive<ResetAdminUserPasswordFormData>({
  newPassword: "",
  confirmPassword: "",
});

function handleSubmit(event: { data: ResetAdminUserPasswordFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UForm :schema="formSchema" :state="form" @submit="handleSubmit">
    <Fieldset :disabled="props.loading" title="Reset password">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <PasswordField
        v-model:password="form.newPassword"
        :error="props.fieldErrors.newPassword"
        id="admin-reset-password-new"
        label="New password"
        name="newPassword"
      />
      <PasswordField
        v-model:password="form.confirmPassword"
        :error="props.fieldErrors.confirmPassword"
        id="admin-reset-password-confirm"
        label="Confirm password"
        name="confirmPassword"
      />

      <UButton class="mt-4" type="submit" :loading="props.loading">
        {{ props.loading ? "Resetting..." : "Reset password" }}
      </UButton>
    </Fieldset>
  </UForm>
</template>
