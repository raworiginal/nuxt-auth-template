<script setup lang="ts">
import type { AdminUser } from "~/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const open = defineModel<boolean>("open", { required: true });
const {
  sessions,
  fieldErrors,
  error,
  successMessage,
  loading,
  clearState,
  load,
} = useAdminUserSessions();
const revokeSession = useRevokeAdminUserSession();
const revokeAllSessions = useRevokeAllAdminUserSessions();
const confirmingSessionId = ref<string | null>(null);
const confirmingAll = ref(false);
const actionLoading = computed(
  () => revokeSession.loading.value || revokeAllSessions.loading.value,
);
const actionError = computed(
  () => revokeSession.error.value || revokeAllSessions.error.value,
);
const actionSuccessMessage = computed(
  () => revokeSession.successMessage.value || revokeAllSessions.successMessage.value,
);
const actionFieldErrors = computed(() => ({
  ...revokeSession.fieldErrors.value,
  ...revokeAllSessions.fieldErrors.value,
}));

const title = computed(() =>
  props.user ? `Sessions for ${props.user.name}` : "User sessions",
);

function loadSelectedUser() {
  if (props.user) void load({ userId: props.user.id });
}

async function handleRevokeSession(sessionId: string) {
  if (!props.user) return;
  const success = await revokeSession.revoke({
    userId: props.user.id,
    sessionId,
  });
  if (success) {
    confirmingSessionId.value = null;
    await load({ userId: props.user.id });
  }
}

async function handleRevokeAllSessions() {
  if (!props.user) return;
  const success = await revokeAllSessions.revoke({ userId: props.user.id });
  if (success) {
    confirmingAll.value = false;
    await load({ userId: props.user.id });
  }
}

function clearActionState() {
  confirmingSessionId.value = null;
  confirmingAll.value = false;
  revokeSession.clearState();
  revokeAllSessions.clearState();
}

watch(open, (isOpen) => {
  if (isOpen) loadSelectedUser();
  else {
    clearState();
    clearActionState();
  }
});

watch(
  () => props.user?.id,
  (userId, previousUserId) => {
    if (userId === previousUserId) return;
    clearState();
    clearActionState();
    if (open.value && userId) void load({ userId });
  },
);
</script>

<template>
  <AppModal
    v-model:open="open"
    :title="title"
    :close-disabled="loading || actionLoading"
  >
    <AdminUserSessionsList
      v-if="props.user"
      :user-id="props.user.id"
      :sessions="sessions"
      :loading="loading"
      :error="error"
      :success-message="successMessage"
      :field-errors="{ ...fieldErrors, ...actionFieldErrors }"
      :action-error="actionError"
      :action-success-message="actionSuccessMessage"
      :action-loading="actionLoading"
      :confirming-session-id="confirmingSessionId"
      :confirming-all="confirmingAll"
      @revoke-session="handleRevokeSession"
      @revoke-all="handleRevokeAllSessions"
      @confirm-session="confirmingSessionId = $event"
      @cancel-session="confirmingSessionId = null"
      @confirm-all="confirmingAll = true"
      @cancel-all="confirmingAll = false"
    />
    <p v-else role="status">Select a user to view sessions.</p>
  </AppModal>
</template>
