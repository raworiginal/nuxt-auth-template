import type { ListUsersOptions } from "~/utils/schemas/admin";

export function useAdminClient() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function listUsers(options?: ListUsersOptions) {
    loading.value = true;
    error.value = null;
    try {
      const response = await admin.listUsers({ query: options ?? {} });
      if (response.error) {
        error.value = getErrorMessage(response.error);
        return null;
      }
      return response.data;
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError);
      return null;
    } finally {
      loading.value = false;
    }
  }
  return { loading, error, listUsers };
}
