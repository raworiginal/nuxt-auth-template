import { getErrorMessage } from "#layers/nuxt-auth-layer/app/utils/error";
import {
  revokeAllAdminUserSessionsResultSchema,
  revokeAllAdminUserSessionsSchema,
} from "#layers/nuxt-auth-layer/app/utils/schemas/admin";
import type { RevokeAllAdminUserSessionsInput } from "#layers/nuxt-auth-layer/app/types/admin";

function getStatusCode(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
    ? error.statusCode
    : undefined;
}

export function useRevokeAllAdminUserSessions() {
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

  async function revoke(input: RevokeAllAdminUserSessionsInput) {
    clearState();
    const parsed = revokeAllAdminUserSessionsSchema.safeParse(input);
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
      const result = await requestFetch("/api/admin/revoke-user-sessions", {
        method: "POST",
        body: parsed.data,
      });
      const response = revokeAllAdminUserSessionsResultSchema.safeParse(result);
      if (!response.success || !response.data.success) {
        error.value = "The server returned an invalid revocation response.";
        return false;
      }
      successMessage.value = "All sessions revoked successfully.";
      return true;
    } catch (caughtError: unknown) {
      const statusCode = getStatusCode(caughtError);
      if (statusCode === 401) {
        error.value = "Your session has expired. Please sign in again.";
      } else if (statusCode === 403) {
        error.value = "You are not authorized to revoke sessions.";
      } else if (statusCode === 400) {
        error.value = "Please select a valid user.";
      } else if (statusCode && statusCode >= 500) {
        error.value = "The server could not revoke the sessions.";
      } else {
        error.value = getErrorMessage(caughtError);
      }
      return false;
    } finally {
      loading.value = false;
    }
  }

  return { fieldErrors, error, successMessage, loading, clearState, revoke };
}
