<script setup lang="ts">
import type {
  AdminUser,
  ListUsersSearchOptions,
} from "~/types/admin";

const props = defineProps<{
  users: AdminUser[];
  total: number;
  loading: boolean;
  error: string | null;
  limit?: number;
  offset?: number;
  pageSizeOptions: readonly number[];
  searchValue: string;
  searchField: "email" | "name";
}>();

const emit = defineEmits<{
  search: [options: ListUsersSearchOptions];
  edit: [user: AdminUser];
  resetPassword: [user: AdminUser];
  ban: [user: AdminUser];
  unban: [user: AdminUser];
  pageChange: [offset: number];
  pageSizeChange: [limit: number];
}>();

const searchValue = ref(props.searchValue);
const searchField = ref<"email" | "name">(props.searchField);

watch(
  () => props.searchValue,
  (value) => {
    searchValue.value = value;
  },
);

watch(
  () => props.searchField,
  (value) => {
    searchField.value = value;
  },
);

function submitSearch() {
  emit("search", {
    searchValue: searchValue.value.trim(),
    searchField: searchField.value,
    searchOperator: "contains",
  });
}
</script>

<template>
  <main>
    <h1>Users</h1>

    <form class="my-4 flex flex-wrap gap-2" @submit.prevent="submitSearch">
      <label class="sr-only" for="admin-user-search">Search users</label>
      <input
        id="admin-user-search"
        v-model="searchValue"
        class="input input-bordered"
        type="search"
        placeholder="Search users"
      />
      <label class="sr-only" for="admin-user-search-field">
        Search field
      </label>
      <select
        id="admin-user-search-field"
        v-model="searchField"
        class="select select-bordered"
      >
        <option value="name">Name</option>
        <option value="email">Email</option>
      </select>
      <button class="btn btn-primary" type="submit">Search</button>
    </form>

    <p v-if="loading">Loading users...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else-if="users.length === 0">No users found.</p>
    <template v-else>
      <p>{{ total }} users found.</p>
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role ?? "user" }}</td>
              <td>
                <span v-if="user.banned" class="text-error">Banned</span>
                <span v-else>Active</span>
                <span v-if="user.banned && user.banReason" class="block text-sm">
                  {{ user.banReason }}
                </span>
                <span v-if="user.banned && user.banExpires" class="block text-sm">
                  Expires: {{ new Date(user.banExpires).toLocaleString() }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-sm"
                  type="button"
                  @click="emit('edit', user)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm ml-2"
                  type="button"
                  @click="emit('resetPassword', user)"
                >
                  Reset password
                </button>
                <button
                  v-if="user.banned"
                  class="btn btn-sm ml-2"
                  type="button"
                  @click="emit('unban', user)"
                >
                  Unban
                </button>
                <button
                  v-else
                  class="btn btn-sm ml-2"
                  type="button"
                  @click="emit('ban', user)"
                >
                  Ban
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <div v-if="!loading && !error" class="mt-4 flex flex-wrap gap-2">
      <label class="sr-only" for="admin-user-page-size">Users per page</label>
      <select
        id="admin-user-page-size"
        class="select select-bordered select-sm"
        :value="limit"
        @change="emit('pageSizeChange', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }} per page
        </option>
      </select>
      <button
        class="btn btn-sm"
        :disabled="!offset"
        @click="emit('pageChange', Math.max(0, (offset ?? 0) - (limit ?? 1)))"
      >
        Previous
      </button>
      <button
        class="btn btn-sm"
        :disabled="(offset ?? 0) + (limit ?? 0) >= total"
        @click="emit('pageChange', (offset ?? 0) + (limit ?? 1))"
      >
        Next
      </button>
    </div>
  </main>
</template>
