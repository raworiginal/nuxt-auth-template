<script setup lang="ts">
import type { AdminUserSession } from "#layers/nuxt-auth-layer/app/types/admin";

defineProps<{
  userId: string;
  sessions: AdminUserSession[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
  actionError: string | null;
  actionSuccessMessage: string | null;
  actionLoading: boolean;
  confirmingSessionId: string | null;
  confirmingAll: boolean;
}>();

const emit = defineEmits<{
  revokeSession: [sessionId: string];
  revokeAll: [];
  confirmSession: [sessionId: string];
  cancelSession: [];
  confirmAll: [];
  cancelAll: [];
}>();

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}
</script>

<template>
  <div aria-live="polite">
    <p class="text-sm text-base-content/70">User ID: {{ userId }}</p>
    <p v-if="loading" class="mt-4" role="status">Loading active sessions...</p>
    <p
      v-else-if="fieldErrors.userId || fieldErrors.sessionId"
      class="mt-4 text-error"
      role="alert"
    >
      {{ fieldErrors.userId || fieldErrors.sessionId }}
    </p>
    <p v-else-if="error" class="mt-4 text-error" role="alert">{{ error }}</p>
    <template v-else-if="sessions.length === 0">
      <p v-if="actionSuccessMessage" class="mt-4 text-success" role="status">
        {{ actionSuccessMessage }}
      </p>
      <p v-if="actionError" class="mt-4 text-error" role="alert">
        {{ actionError }}
      </p>
      <p class="mt-4" role="status">This user has no active sessions.</p>
    </template>
    <template v-else>
      <p v-if="successMessage" class="mt-4 text-success" role="status">
        {{ successMessage }}
      </p>
      <p v-if="actionSuccessMessage" class="mt-4 text-success" role="status">
        {{ actionSuccessMessage }}
      </p>
      <p v-if="actionError" class="mt-4 text-error" role="alert">
        {{ actionError }}
      </p>
      <h3 class="mt-4 font-semibold">Active sessions</h3>
      <div class="mt-3">
        <button
          v-if="!confirmingAll"
          class="btn btn-error btn-sm"
          type="button"
          :disabled="actionLoading"
          @click="emit('confirmAll')"
        >
          Revoke all sessions
        </button>
        <div v-else class="rounded border border-error p-3" role="alertdialog" aria-label="Confirm revoke all sessions">
          <p>Revoke all sessions for this user?</p>
          <button class="btn btn-error btn-sm mt-2" type="button" :disabled="actionLoading" @click="emit('revokeAll')">
            {{ actionLoading ? "Revoking..." : "Yes, revoke all" }}
          </button>
          <button class="btn btn-sm ml-2 mt-2" type="button" :disabled="actionLoading" @click="emit('cancelAll')">
            Cancel
          </button>
        </div>
      </div>
      <ul class="mt-2 space-y-3" aria-label="Active sessions">
        <li
          v-for="session in sessions"
          :key="session.id"
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
          <div class="mt-3">
            <button
              v-if="confirmingSessionId !== session.id"
              class="btn btn-error btn-sm"
              type="button"
              :disabled="actionLoading"
              @click="emit('confirmSession', session.id)"
            >
              Revoke
            </button>
            <div v-else class="rounded border border-error p-3" role="alertdialog" aria-label="Confirm revoke session">
              <p>Revoke this session?</p>
              <button class="btn btn-error btn-sm mt-2" type="button" :disabled="actionLoading" @click="emit('revokeSession', session.id)">
                {{ actionLoading ? "Revoking..." : "Yes, revoke" }}
              </button>
              <button class="btn btn-sm ml-2 mt-2" type="button" :disabled="actionLoading" @click="emit('cancelSession')">
                Cancel
              </button>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
