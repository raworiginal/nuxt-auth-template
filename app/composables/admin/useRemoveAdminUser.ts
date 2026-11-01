import { getErrorMessage } from "~/utils/error";
import {
  removeAdminUserResultSchema,
  selectedAdminUserIdSchema,
} from "~/utils/schemas/admin";
import type { RemoveAdminUserInput } from "~/types/admin";

function getStatusCode(error: unknown) {
  if (typeof error !== "object" || error === null) return undefined;

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if ("status" in error && typeof error.status === "number") {
    return error.status;
  }

  return undefined;
}

export function useRemoveAdminUser() {
  const requestFetch = useAuthRequestFetch();
  const fieldErrors = ref<Record<string, string>>({});
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const loading = ref(false);

  function clearState() {
    fieldErrors.value = {};
    error.value = null;
    successMessage.value = null;
  }

  async function remove(input: RemoveAdminUserInput) {
    clearState();

    const parsed = selectedAdminUserIdSchema.safeParse(input);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return false;
    }

    loading.value = true;
    try {
      const response = removeAdminUserResultSchema.safeParse(
        await requestFetch("/api/admin/remove-user", {
          method: "POST",
          body: parsed.data,
        }),
      );
      if (!response.success || !response.data.success) {
        error.value = "The server returned an invalid removal response.";
        return false;
      }

      successMessage.value = "User removed successfully.";
      return true;
    } catch (caughtError: unknown) {
      const statusCode = getStatusCode(caughtError);
      if (statusCode === 401) {
        error.value = "Your session has expired. Please sign in again.";
      } else if (statusCode === 403) {
        error.value = "You are not authorized to remove users.";
      } else if (statusCode === 404) {
        error.value = "The selected user was not found.";
      } else if (statusCode === 400) {
        const message = getErrorMessage(caughtError);
        error.value = message.toLowerCase().includes("cannot remove yourself")
          ? "You cannot remove yourself."
          : "This user cannot be removed. Please select another user.";
      } else if (statusCode && statusCode >= 500) {
        error.value = "The server could not remove the user.";
      } else {
        error.value = getErrorMessage(caughtError);
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { fieldErrors, error, successMessage, loading, clearState, remove };
}
