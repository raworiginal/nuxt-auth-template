<script setup lang="ts">
import type { ListUsersSearchOptions } from "~/types/admin";

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
    <button
      class="btn btn-primary w-full sm:w-auto"
      type="button"
      @click="emit('create')"
    >
      Create user
    </button>
  </div>
</template>
