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

const title = computed(() =>
  props.user ? `Sessions for ${props.user.name}` : "User sessions",
);

function loadSelectedUser() {
  if (props.user) void load({ userId: props.user.id });
}

watch(open, (isOpen) => {
  if (isOpen) loadSelectedUser();
  else clearState();
});

watch(
  () => props.user?.id,
  (userId, previousUserId) => {
    if (userId === previousUserId) return;
    clearState();
    if (open.value && userId) void load({ userId });
  },
);
</script>

<template>
  <AppModal v-model:open="open" :title="title" :close-disabled="loading">
    <AdminUserSessionsList
      v-if="props.user"
      :user-id="props.user.id"
      :sessions="sessions"
      :loading="loading"
      :error="error"
      :success-message="successMessage"
      :field-errors="fieldErrors"
    />
    <p v-else role="status">Select a user to view sessions.</p>
  </AppModal>
</template>
