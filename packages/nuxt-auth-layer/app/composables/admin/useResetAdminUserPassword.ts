import { getErrorMessage } from "#layers/nuxt-auth-layer/app/utils/error";
import { resetAdminUserPasswordSchema } from "#layers/nuxt-auth-layer/app/utils/schemas/admin";
import type { ResetAdminUserPasswordInput } from "#layers/nuxt-auth-layer/app/types/admin";

export function useResetAdminUserPassword() {
  const action = useAuthClientAction(
    (client) => client.admin.setUserPassword,
  );
  const fieldErrors = ref<Record<string, string>>({});
  const successMessage = ref<string | null>(null);
  const showActionError = ref(false);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() =>
    showActionError.value && action.status.value === "error" && action.error.value
      ? getErrorMessage(action.error.value)
      : null,
  );

  function clearState() {
    fieldErrors.value = {};
    successMessage.value = null;
    showActionError.value = false;
  }

  async function submit(input: ResetAdminUserPasswordInput) {
    clearState();

    const result = resetAdminUserPasswordSchema.safeParse(input);

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
      userId: result.data.userId,
      newPassword: result.data.newPassword,
    });

    showActionError.value = true;

    if (action.status.value !== "success") return;

    successMessage.value = "Password reset successfully.";
  }

  return {
    fieldErrors,
    loading,
    error,
    successMessage,
    clearState,
    submit,
  };
}
