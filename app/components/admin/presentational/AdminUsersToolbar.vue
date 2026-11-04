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
  <AdminUsersSearch
    :search-value="searchValue"
    :search-field="searchField"
    @search="emit('search', $event)"
  />
  <button class="btn btn-primary" type="button" @click="emit('create')">
    Create user
  </button>
</template>
