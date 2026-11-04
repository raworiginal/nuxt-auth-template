<script setup lang="ts">
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
const editUser = ref<AdminUser | null>(null);
const editOpen = ref(false);
const resetUser = ref<AdminUser | null>(null);
const resetOpen = ref(false);
const banUser = ref<AdminUser | null>(null);
const banOpen = ref(false);
const unbanUser = ref<AdminUser | null>(null);
const unbanOpen = ref(false);
const sessionsUser = ref<AdminUser | null>(null);
const sessionsOpen = ref(false);
const removeUser = ref<AdminUser | null>(null);
const removeOpen = ref(false);
const removeStatus = ref<string | null>(null);

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

function handleEdit(user: AdminUser) {
  editUser.value = user;
  editOpen.value = true;
}

function handleResetPassword(user: AdminUser) {
  resetUser.value = user;
  resetOpen.value = true;
}

function handleBan(user: AdminUser) {
  banUser.value = user;
  banOpen.value = true;
}

function handleUnban(user: AdminUser) {
  unbanUser.value = user;
  unbanOpen.value = true;
}

function handleViewSessions(user: AdminUser) {
  sessionsUser.value = user;
  sessionsOpen.value = true;
}

function handleRemove(user: AdminUser) {
  removeStatus.value = null;
  removeUser.value = user;
  removeOpen.value = true;
}

function handleRemoved() {
  removeStatus.value = "User removed successfully.";
  void refresh();
}

watch(editOpen, (isOpen) => {
  if (!isOpen) editUser.value = null;
});

watch(resetOpen, (isOpen) => {
  if (!isOpen) resetUser.value = null;
});

watch(banOpen, (isOpen) => {
  if (!isOpen) banUser.value = null;
});

watch(unbanOpen, (isOpen) => {
  if (!isOpen) unbanUser.value = null;
});

watch(sessionsOpen, (isOpen) => {
  if (!isOpen) sessionsUser.value = null;
});

watch(removeOpen, (isOpen) => {
  if (!isOpen) removeUser.value = null;
});
</script>

<template>
  <AdminEditUserContainer
    v-model:open="editOpen"
    :user="editUser"
    @updated="refresh"
  />
  <AdminResetPasswordContainer
    v-model:open="resetOpen"
    :user="resetUser"
    @reset="refresh"
  />
  <AdminBanUserContainer
    v-model:open="banOpen"
    :user="banUser"
    @banned="refresh"
  />
  <AdminUnbanUserContainer
    v-model:open="unbanOpen"
    :user="unbanUser"
    @unbanned="refresh"
  />
  <AdminUserSessionsContainer
    v-model:open="sessionsOpen"
    :user="sessionsUser"
  />
  <AdminRemoveUserContainer
    v-model:open="removeOpen"
    :user="removeUser"
    @removed="handleRemoved"
  />

  <p v-if="removeStatus" class="sr-only" role="status" aria-live="polite">
    {{ removeStatus }}
  </p>

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
      @edit="handleEdit"
      @reset-password="handleResetPassword"
      @ban="handleBan"
      @unban="handleUnban"
      @remove="handleRemove"
      @view-sessions="handleViewSessions"
      @page-size-change="updateOptions({ limit: $event, offset: 0 })"
      @page-change="updateOptions({ offset: $event })"
    />
  </main>
</template>
