<script setup lang="ts">
import type { AdminUser } from "#layers/nuxt-auth-layer/app/types/admin";

const props = defineProps<{
  user: AdminUser | null;
}>();

const emit = defineEmits<{
  unbanned: [];
}>();

const open = defineModel<boolean>("open", { required: true });
const {
  fieldErrors,
  loading,
  error,
  successMessage,
  clearState,
  submit,
} = useUnbanAdminUser();

const title = computed(() =>
  props.user ? `Unban ${props.user.name}` : "Unban user",
);

watch(open, (isOpen) => {
  if (isOpen) clearState();
});

watch(successMessage, (message) => {
  if (message) emit("unbanned");
});

function handleConfirm() {
  if (!props.user) return;
  return submit({ userId: props.user.id });
}
</script>

<template>
  <AppModal v-model:open="open" :title="title" :close-disabled="loading">
    <div v-if="props.user">
      <p>
        Are you sure you want to unban <strong>{{ props.user.name }}</strong>?
      </p>
      <p v-if="error" class="text-error mt-2" role="alert">{{ error }}</p>
      <p v-if="fieldErrors.userId" class="text-error mt-2" role="alert">
        {{ fieldErrors.userId }}
      </p>
      <p v-if="successMessage" class="text-success mt-2" role="status">
        {{ successMessage }}
      </p>
      <button
        class="btn btn-primary mt-4"
        type="button"
        :disabled="loading"
        @click="handleConfirm"
      >
        <span v-if="loading" class="loading loading-spinner" />
        {{ loading ? "Unbanning..." : "Unban user" }}
      </button>
    </div>
  </AppModal>
</template>
