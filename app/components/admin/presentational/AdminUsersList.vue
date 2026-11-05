<script setup lang="ts">
import type { AdminUser } from "~/types/admin";

const props = defineProps<{
  users: AdminUser[];
  total: number;
  loading: boolean;
  error: string | null;
  limit?: number;
  offset?: number;
  pageSizeOptions: readonly number[];
}>();

const emit = defineEmits<{
  edit: [user: AdminUser];
  resetPassword: [user: AdminUser];
  ban: [user: AdminUser];
  unban: [user: AdminUser];
  remove: [user: AdminUser];
  viewSessions: [user: AdminUser];
  pageChange: [offset: number];
  pageSizeChange: [limit: number];
}>();
</script>

<template>
  <p v-if="loading" class="py-8 text-center text-base-content/70" role="status">
    Loading users...
  </p>
  <p v-else-if="error" class="py-4 text-error" role="alert">{{ error }}</p>
  <p v-else-if="users.length === 0" class="py-8 text-center text-base-content/70">
    No users found.
  </p>
  <template v-else>
    <p class="mb-3 text-sm text-base-content/70" aria-live="polite">
      {{ total }} users found.
    </p>

    <ul class="space-y-3 md:hidden" aria-label="Users">
      <li
        v-for="user in users"
        :key="user.id"
        class="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm"
      >
        <div class="min-w-0">
          <h2 class="break-words font-semibold">{{ user.name }}</h2>
          <p class="mt-1 break-all text-sm text-base-content/70">
            {{ user.email }}
          </p>
        </div>
        <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          <div>
            <dt class="font-medium text-base-content/70">Role</dt>
            <dd class="mt-1 break-words">{{ user.role ?? "user" }}</dd>
          </div>
          <div>
            <dt class="font-medium text-base-content/70">Status</dt>
            <dd class="mt-1">
              <span
                class="badge"
                :class="user.banned ? 'badge-error' : 'badge-success badge-outline'"
              >
                {{ user.banned ? "Banned" : "Active" }}
              </span>
            </dd>
          </div>
          <div v-if="user.banned && user.banReason" class="col-span-2">
            <dt class="font-medium text-base-content/70">Ban reason</dt>
            <dd class="mt-1 break-words">{{ user.banReason }}</dd>
          </div>
          <div v-if="user.banned && user.banExpires" class="col-span-2">
            <dt class="font-medium text-base-content/70">Ban expires</dt>
            <dd class="mt-1">{{ new Date(user.banExpires).toLocaleString() }}</dd>
          </div>
        </dl>
        <div class="mt-4 border-t border-base-300 pt-3">
          <AdminUserActions
            :user="user"
            @edit="emit('edit', $event)"
            @reset-password="emit('resetPassword', $event)"
            @ban="emit('ban', $event)"
            @unban="emit('unban', $event)"
            @remove="emit('remove', $event)"
            @view-sessions="emit('viewSessions', $event)"
          />
        </div>
      </li>
    </ul>

    <div class="hidden overflow-x-auto rounded-box border border-base-300 md:block">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="align-top">
            <td class="max-w-56 break-words">{{ user.name }}</td>
            <td class="max-w-64 break-all">{{ user.email }}</td>
            <td>{{ user.role ?? "user" }}</td>
            <td>
              <span
                class="badge"
                :class="user.banned ? 'badge-error' : 'badge-success badge-outline'"
              >
                {{ user.banned ? "Banned" : "Active" }}
              </span>
              <span v-if="user.banned && user.banReason" class="block text-sm">
                {{ user.banReason }}
              </span>
              <span v-if="user.banned && user.banExpires" class="block text-sm">
                Expires: {{ new Date(user.banExpires).toLocaleString() }}
              </span>
            </td>
            <td class="min-w-48">
              <AdminUserActions
                :user="user"
                @edit="emit('edit', $event)"
                @reset-password="emit('resetPassword', $event)"
                @ban="emit('ban', $event)"
                @unban="emit('unban', $event)"
                @remove="emit('remove', $event)"
                @view-sessions="emit('viewSessions', $event)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>

  <div
    v-if="!loading && !error"
    class="mt-5 flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between"
  >
    <label class="flex items-center gap-2 text-sm" for="admin-user-page-size">
      <span>Users per page</span>
      <select
        id="admin-user-page-size"
        class="select select-bordered select-sm"
        :value="limit"
        @change="emit('pageSizeChange', Number(($event.target as HTMLSelectElement).value))"
      >
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </label>
    <div class="grid grid-cols-2 gap-2 sm:flex sm:items-center">
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
  </div>
</template>
