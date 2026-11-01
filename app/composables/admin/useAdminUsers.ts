import type { ListUsersResult } from "~/types/admin";
import type { ListUsersOptions } from "~/types/admin";

export async function useAdminUsers(
  options: ComputedRef<ListUsersOptions>,
) {
  const { data, pending, error, refresh } = await useAuthAsyncData(
    "admin-users",
    (requestFetch) => {
      const params = new URLSearchParams();
      const {
        limit,
        offset,
        searchValue,
        searchField,
        searchOperator,
      } = options.value;

      if (limit !== undefined) params.set("limit", String(limit));
      if (offset !== undefined) params.set("offset", String(offset));
      if (searchValue) params.set("searchValue", searchValue);
      if (searchField) params.set("searchField", searchField);
      if (searchOperator) params.set("searchOperator", searchOperator);

      return requestFetch<ListUsersResult>(
        `/api/auth/admin/list-users?${params.toString()}`,
      );
    },
    { watch: [options] },
  );

  return {
    users: computed(() => data.value?.users ?? []),
    total: computed(() => data.value?.total ?? 0),
    loading: pending,
    error: computed(() => error.value?.message ?? null),
    refresh,
  };
}
