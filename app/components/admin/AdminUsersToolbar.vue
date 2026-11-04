<script setup lang="ts">
import type { ListUsersSearchOptions } from "~/types/admin";

defineProps<{
  searchValue: string;
  searchField: "email" | "name";
}>();

const emit = defineEmits<{
  search: [options: ListUsersSearchOptions];
  created: [];
}>();
</script>

<template>
  <AdminUsersSearch
    :search-value="searchValue"
    :search-field="searchField"
    @search="emit('search', $event)"
  />
  <AdminCreateUserContainer @created="emit('created')" />
</template>
