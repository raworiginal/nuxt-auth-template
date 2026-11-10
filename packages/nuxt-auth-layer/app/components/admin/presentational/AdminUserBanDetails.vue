<script setup lang="ts">
import type { AdminUser } from "#layers/nuxt-auth-layer/app/types/admin";

defineProps<{
  user: AdminUser;
}>();
</script>

<template>
  <details
    v-if="user.banned && (user.banReason || user.banExpires)"
    class="mt-2 text-sm"
  >
    <summary
      class="cursor-pointer font-medium text-base-content/70 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Ban details
    </summary>
    <dl class="mt-2 space-y-1 rounded-box bg-base-200 p-3">
      <div v-if="user.banReason">
        <dt class="font-medium">Reason</dt>
        <dd class="break-words">{{ user.banReason }}</dd>
      </div>
      <div v-if="user.banExpires">
        <dt class="font-medium">Expires</dt>
        <dd>{{ new Date(user.banExpires).toLocaleString() }}</dd>
      </div>
    </dl>
  </details>
</template>
