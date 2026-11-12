<script setup lang="ts">
import type { ListUsersSearchOptions } from "#shared/auth/types/admin";

defineProps<{
  searchValue: string;
  searchField: "email" | "name";
}>();

const emit = defineEmits<{
  search: [options: ListUsersSearchOptions];
  created: [];
}>();

const createUserOpen = ref(false);
</script>

<template>
  <AdminUsersToolbar
    :search-value="searchValue"
    :search-field="searchField"
    @search="emit('search', $event)"
    @create="createUserOpen = true"
  />

  <AdminCreateUserContainer
    v-model:open="createUserOpen"
    @created="emit('created')"
  />
</template>
