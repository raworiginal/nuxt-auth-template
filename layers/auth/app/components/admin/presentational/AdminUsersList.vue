<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { AdminUser } from "#shared/auth/types/admin";

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

const providerLabels: Record<string, string> = {
  credential: "Email / password",
  github: "GitHub",
  google: "Google",
};

const columns: TableColumn<AdminUser>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "providers", header: "Sign-in providers" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "banned", header: "Status" },
  { id: "actions", header: "Actions" },
];

const pageSizeItems = computed(() =>
  props.pageSizeOptions.map((size) => ({ label: String(size), value: size })),
);

function formatProvider(provider: string) {
  return (
    providerLabels[provider] ??
    provider
      .split(/[-_]/)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}
</script>

<template>
  <div class="space-y-4">
    <UAlert
      v-if="error"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      title="Unable to load users"
      :description="error"
      role="alert"
    />

    <p v-if="!error" class="text-sm text-muted" aria-live="polite">
      {{ total }} {{ total === 1 ? "user" : "users" }} found.
    </p>

    <UEmpty
      v-if="users.length === 0 && !loading && !error"
      class="md:hidden"
      icon="i-lucide-users-round"
      title="No users found"
      description="Try changing your search or create a user."
    />
    <p
      v-else-if="loading"
      class="py-8 text-center text-muted md:hidden"
      role="status"
    >
      Loading users...
    </p>

    <ul
      v-if="users.length > 0 && !error"
      class="space-y-3 md:hidden"
      aria-label="Users"
    >
      <li v-for="user in users" :key="user.id">
        <UCard>
          <div class="min-w-0">
            <h2 class="break-words font-semibold">{{ user.name }}</h2>
            <p class="mt-1 break-all text-sm text-muted">{{ user.email }}</p>
          </div>
          <dl class="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt class="font-medium text-muted">Role</dt>
              <dd class="mt-1 break-words">{{ user.role ?? "user" }}</dd>
            </div>
            <div>
              <dt class="font-medium text-muted">Status</dt>
              <dd class="mt-1">
                <UBadge :color="user.banned ? 'error' : 'success'">
                  {{ user.banned ? "Banned" : "Active" }}
                </UBadge>
              </dd>
            </div>
            <div class="col-span-2">
              <dt class="font-medium text-muted">Sign-in providers</dt>
              <dd class="mt-1 flex flex-wrap gap-1">
                <UBadge
                  v-for="provider in user.providers ?? []"
                  :key="provider"
                  color="neutral"
                  variant="outline"
                >
                  {{ formatProvider(provider) }}
                </UBadge>
                <span v-if="!user.providers?.length" class="text-muted">
                  None
                </span>
              </dd>
            </div>
            <div
              v-if="user.banned && (user.banReason || user.banExpires)"
              class="col-span-2"
            >
              <AdminUserBanDetails :user="user" />
            </div>
          </dl>
          <div class="mt-4 border-t border-default pt-3">
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
        </UCard>
      </li>
    </ul>

    <div v-if="!error" class="hidden overflow-x-auto md:block">
      <UTable
        :data="users"
        :columns="columns"
        :loading="loading"
        class="min-w-[48rem]"
      >
        <template #empty>
          <p v-if="loading" class="py-8 text-center text-muted" role="status">
            Loading users...
          </p>
          <UEmpty
            v-else
            icon="i-lucide-users-round"
            title="No users found"
            description="Try changing your search or create a user."
          />
        </template>
        <template #name-cell="{ row }">
          <span class="max-w-56 break-words">{{ row.original.name }}</span>
        </template>
        <template #email-cell="{ row }">
          <span class="max-w-64 break-all">{{ row.original.email }}</span>
        </template>
        <template #providers-cell="{ row }">
          <div class="flex min-w-40 flex-wrap gap-1">
            <UBadge
              v-for="provider in row.original.providers ?? []"
              :key="provider"
              color="neutral"
              variant="outline"
            >
              {{ formatProvider(provider) }}
            </UBadge>
            <span v-if="!row.original.providers?.length" class="text-muted">
              None
            </span>
          </div>
        </template>
        <template #role-cell="{ row }">
          {{ row.original.role ?? "user" }}
        </template>
        <template #banned-cell="{ row }">
          <div class="min-w-36">
            <UBadge :color="row.original.banned ? 'error' : 'success'">
              {{ row.original.banned ? "Banned" : "Active" }}
            </UBadge>
            <AdminUserBanDetails :user="row.original" />
          </div>
        </template>
        <template #actions-cell="{ row }">
          <AdminUserActions
            :user="row.original"
            @edit="emit('edit', $event)"
            @reset-password="emit('resetPassword', $event)"
            @ban="emit('ban', $event)"
            @unban="emit('unban', $event)"
            @remove="emit('remove', $event)"
            @view-sessions="emit('viewSessions', $event)"
          />
        </template>
      </UTable>
    </div>

    <div
      v-if="!loading && !error"
      class="flex flex-col gap-3 border-t border-default pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-2 text-sm">
        <span>Users per page</span>
        <USelect
          id="admin-user-page-size"
          class="w-24"
          :items="pageSizeItems"
          :model-value="limit"
          aria-label="Users per page"
          @update:model-value="emit('pageSizeChange', Number($event))"
        />
      </div>
      <UPagination
        v-if="total > 0"
        :page="Math.floor((offset ?? 0) / (limit ?? 1)) + 1"
        :items-per-page="limit ?? 1"
        :total="total"
        size="sm"
        @update:page="emit('pageChange', ($event - 1) * (limit ?? 1))"
      />
    </div>
  </div>
</template>
