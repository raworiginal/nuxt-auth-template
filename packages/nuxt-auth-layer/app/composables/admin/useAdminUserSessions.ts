import { getErrorMessage } from "#layers/nuxt-auth-layer/app/utils/error";
import {
  listAdminUserSessionsResultSchema,
  listAdminUserSessionsSchema,
} from "#layers/nuxt-auth-layer/app/utils/schemas/admin";
import type {
  AdminUserSession,
  ListAdminUserSessionsInput,
} from "#layers/nuxt-auth-layer/app/types/admin";

export function useAdminUserSessions() {
  const sessions = ref<AdminUserSession[]>([]);
  const fieldErrors = ref<Record<string, string>>({});
  const error = ref<string | null>(null);
  const successMessage = ref<string | null>(null);
  const loading = ref(false);
  const requestFetch = useAuthRequestFetch();

  function clearState() {
    sessions.value = [];
    fieldErrors.value = {};
    error.value = null;
    successMessage.value = null;
  }

  async function load(input: ListAdminUserSessionsInput) {
    clearState();

    const inputResult = listAdminUserSessionsSchema.safeParse(input);
    if (!inputResult.success) {
      for (const issue of inputResult.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    loading.value = true;
    try {
      const result = await requestFetch("/api/admin/user-sessions", {
        method: "POST",
        body: inputResult.data,
      });
      const parsed = listAdminUserSessionsResultSchema.safeParse(result);

      if (!parsed.success) {
        error.value = "The server returned an invalid sessions response.";
        return;
      }

      sessions.value = parsed.data.sessions;
      successMessage.value = "Sessions loaded successfully.";
    } catch (caughtError: unknown) {
      const statusCode =
        typeof caughtError === "object" && caughtError !== null &&
        "statusCode" in caughtError &&
        typeof caughtError.statusCode === "number"
          ? caughtError.statusCode
          : undefined;

      if (statusCode === 401) {
        error.value = "Your session has expired. Please sign in again.";
      } else if (statusCode === 403) {
        error.value = "You are not authorized to view user sessions.";
      } else if (statusCode && statusCode >= 500) {
        error.value = "The server could not load user sessions.";
      } else {
        error.value = getErrorMessage(caughtError);
      }
    } finally {
      loading.value = false;
    }
  }

  return { sessions, fieldErrors, error, successMessage, loading, clearState, load };
}
