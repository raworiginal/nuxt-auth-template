<script setup lang="ts">
import AdminUsersDialogs from "./AdminUsersDialogs.vue";
import type { AdminUser } from "~/types/admin";
import { ADMIN_USERS_PAGE_SIZE_OPTIONS } from "~/utils/constants/admin";

const { options, updateOptions, handleSearch } = useAdminUsersQuery();

const { users, total, loading, error, refresh } = await useAdminUsers(options);
const dialogs = ref<InstanceType<typeof AdminUsersDialogs> | null>(null);

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

    <AdminUsersToolbarContainer
      :search-value="options.searchValue ?? ''"
      :search-field="options.searchField ?? 'name'"
      @search="handleSearch"
      @created="refresh"
    />

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
