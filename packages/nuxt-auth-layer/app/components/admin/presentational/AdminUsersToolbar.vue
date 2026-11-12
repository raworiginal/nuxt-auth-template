<script setup lang="ts">
import type { ListUsersSearchOptions } from "#layers/nuxt-auth-layer/app/types/admin";

defineProps<{
  searchValue: string;
  searchField: "email" | "name";
}>();

const emit = defineEmits<{
  search: [options: ListUsersSearchOptions];
  create: [];
}>();
</script>

<template>
  <div class="my-5 flex flex-col gap-3 sm:flex-row sm:items-end">
    <AdminUsersSearch
      class="min-w-0 flex-1"
      :search-value="searchValue"
      :search-field="searchField"
      @search="emit('search', $event)"
    />
    <UButton
      class="w-full sm:w-auto"
      type="button"
      @click="emit('create')"
    >
      Create user
    </UButton>
  </div>
</template>
