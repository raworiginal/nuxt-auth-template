import {
  passwordChangeSchema,
} from "#shared/auth/schemas/auth";
import type { ChangePasswordFormData } from "#shared/auth/types/auth";

export function useChangePassword() {
  const action = useAuthClientAction((client) => client.changePassword);
  const fieldErrors = ref<Record<string, string>>({});
  const successMessage = ref<string | null>(null);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function submit(input: ChangePasswordFormData) {
    fieldErrors.value = {};
    successMessage.value = null;
    const result = passwordChangeSchema.safeParse(input);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    await action.execute({
      currentPassword: result.data.currentPassword,
      newPassword: result.data.newPassword,
    });

    if (action.status.value !== "success") return;

    successMessage.value = "Password changed successfully.";
  }

  return { fieldErrors, loading, error, successMessage, submit };
}
