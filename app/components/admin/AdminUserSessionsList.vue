<script setup lang="ts">
import type { AdminUserSession } from "~/types/admin";

defineProps<{
  userId: string;
  sessions: AdminUserSession[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
</script>

<template>
  <div aria-live="polite">
    <p class="text-sm text-base-content/70">User ID: {{ userId }}</p>
    <p v-if="loading" class="mt-4" role="status">Loading active sessions...</p>
    <p v-else-if="fieldErrors.userId" class="mt-4 text-error" role="alert">
      {{ fieldErrors.userId }}
    </p>
    <p v-else-if="error" class="mt-4 text-error" role="alert">{{ error }}</p>
    <p v-else-if="sessions.length === 0" class="mt-4" role="status">
      This user has no active sessions.
    </p>
    <template v-else>
      <p v-if="successMessage" class="mt-4 text-success" role="status">
        {{ successMessage }}
      </p>
      <h3 class="mt-4 font-semibold">Active sessions</h3>
      <ul class="mt-2 space-y-3" aria-label="Active sessions">
        <li
          v-for="(session, index) in sessions"
          :key="`${session.createdAt}-${session.expiresAt}-${index}`"
          class="rounded border border-base-300 p-3"
        >
          <dl class="text-sm">
            <div>
              <dt class="font-medium">Created</dt>
              <dd>{{ formatDate(session.createdAt) }}</dd>
            </div>
            <div class="mt-2">
              <dt class="font-medium">Expires</dt>
              <dd>{{ formatDate(session.expiresAt) }}</dd>
            </div>
          </dl>
        </li>
      </ul>
    </template>
  </div>
</template>
