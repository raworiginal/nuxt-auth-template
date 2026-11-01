import { getErrorMessage } from "~/utils/error";
import { unbanAdminUserSchema } from "~/utils/schemas/admin";
import type { UnbanAdminUserInput } from "~/types/admin";

export function useUnbanAdminUser() {
  const action = useAuthClientAction((client) => client.admin.unbanUser);
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

  async function submit(input: UnbanAdminUserInput) {
    clearState();

    const result = unbanAdminUserSchema.safeParse(input);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    await action.execute({ userId: result.data.userId });
    showActionError.value = true;
    if (action.status.value === "success") {
      successMessage.value = "User unbanned successfully.";
    }
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
