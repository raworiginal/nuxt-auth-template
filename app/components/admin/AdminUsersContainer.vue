<script setup lang="ts">
import AdminUsersDialogs from "./AdminUsersDialogs.vue";
import {
  ADMIN_USERS_PAGE_SIZE_OPTIONS,
  DEFAULT_ADMIN_USERS_PAGE_SIZE,
} from "~/utils/constants/admin";
import type { ListUsersOptions, ListUsersSearchOptions } from "~/types/admin";
import type { AdminUser } from "~/types/admin";

const route = useRoute();
const router = useRouter();

function parseQueryNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

const options = computed<ListUsersOptions>(() => ({
  limit: parseQueryNumber(route.query.limit, DEFAULT_ADMIN_USERS_PAGE_SIZE),
  offset: parseQueryNumber(route.query.offset, 0),
  searchValue:
    typeof route.query.searchValue === "string"
      ? route.query.searchValue
      : undefined,
  searchField:
    route.query.searchField === "email" || route.query.searchField === "name"
      ? route.query.searchField
      : "name",
  searchOperator: "contains",
}));

const { users, total, loading, error, refresh } = await useAdminUsers(options);
const dialogs = ref<InstanceType<typeof AdminUsersDialogs> | null>(null);

async function updateOptions(next: Partial<ListUsersOptions>) {
  const query = { ...route.query };

  for (const [key, value] of Object.entries(next)) {
    if (value === undefined || value === "") {
      delete query[key];
    } else {
      query[key] = String(value);
    }
  }

  await router.replace({
    query,
  });
}

async function handleSearch(search: ListUsersSearchOptions) {
  await updateOptions({
    ...search,
    offset: 0,
  });
}

function openDialog(
  action: Parameters<NonNullable<typeof dialogs.value>["open"]>[0],
  user: AdminUser,
) {
  dialogs.value?.open(action, user);
}
</script>

<template>
  <AdminUsersDialogs ref="dialogs" @refresh="refresh" />

  <main>
    <h1>Users</h1>

    <AdminUsersSearch
      :search-value="options.searchValue ?? ''"
      :search-field="options.searchField ?? 'name'"
      @search="handleSearch"
    />
    <AdminCreateUserContainer @created="refresh" />

    <AdminUsersList
      :users="users"
      :total="total"
      :loading="loading"
      :error="error"
      :limit="options.limit"
      :offset="options.offset"
      :page-size-options="ADMIN_USERS_PAGE_SIZE_OPTIONS"
      @edit="openDialog('edit', $event)"
      @reset-password="openDialog('resetPassword', $event)"
      @ban="openDialog('ban', $event)"
      @unban="openDialog('unban', $event)"
      @remove="openDialog('remove', $event)"
      @view-sessions="openDialog('viewSessions', $event)"
      @page-size-change="updateOptions({ limit: $event, offset: 0 })"
      @page-change="updateOptions({ offset: $event })"
    />
  </main>
</template>
