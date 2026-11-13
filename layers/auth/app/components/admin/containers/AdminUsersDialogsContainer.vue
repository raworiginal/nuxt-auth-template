<script setup lang="ts">
import AdminRemoveUserContainer from "./AdminRemoveUserContainer.vue";
import type { AdminUser } from "#shared/auth/types/admin";

type DialogAction =
  | "edit"
  | "resetPassword"
  | "ban"
  | "unban"
  | "viewSessions"
  | "remove";

const emit = defineEmits<{
  refresh: [];
}>();

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
const overlay = useOverlay();
const removeDialog = overlay.create(AdminRemoveUserContainer);

function open(action: DialogAction, user: AdminUser) {
  switch (action) {
    case "edit":
      editUser.value = user;
      editOpen.value = true;
      break;
    case "resetPassword":
      resetUser.value = user;
      resetOpen.value = true;
      break;
    case "ban":
      banUser.value = user;
      banOpen.value = true;
      break;
    case "unban":
      unbanUser.value = user;
      unbanOpen.value = true;
      break;
    case "viewSessions":
      sessionsUser.value = user;
      sessionsOpen.value = true;
      break;
    case "remove":
      void confirmRemove(user);
      break;
  }
}

async function confirmRemove(user: AdminUser) {
  const { result } = removeDialog.open({ user });
  if (await result) emit("refresh");
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

defineExpose({ open });
</script>

<template>
  <AdminEditUserContainer
    v-model:open="editOpen"
    :user="editUser"
    @updated="emit('refresh')"
  />
  <AdminResetPasswordContainer
    v-model:open="resetOpen"
    :user="resetUser"
    @reset="emit('refresh')"
  />
  <AdminBanUserContainer
    v-model:open="banOpen"
    :user="banUser"
    @banned="emit('refresh')"
  />
  <AdminUnbanUserContainer
    v-model:open="unbanOpen"
    :user="unbanUser"
    @unbanned="emit('refresh')"
  />
  <AdminUserSessionsContainer
    v-model:open="sessionsOpen"
    :user="sessionsUser"
  />
</template>
