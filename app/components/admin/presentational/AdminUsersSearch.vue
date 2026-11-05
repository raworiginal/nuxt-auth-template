<script setup lang="ts">
import type { ListUsersSearchOptions } from "~/types/admin";

const props = defineProps<{
  searchValue: string;
  searchField: "email" | "name";
}>();

const emit = defineEmits<{
  search: [options: ListUsersSearchOptions];
}>();

const searchValue = ref(props.searchValue);
const searchField = ref<"email" | "name">(props.searchField);

watch(
  () => props.searchValue,
  (value) => {
    searchValue.value = value;
  },
);

watch(
  () => props.searchField,
  (value) => {
    searchField.value = value;
  },
);

function submitSearch() {
  emit("search", {
    searchValue: searchValue.value.trim(),
    searchField: searchField.value,
    searchOperator: "contains",
  });
}
</script>

<template>
  <form
    class="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center"
    @submit.prevent="submitSearch"
  >
    <label class="sr-only" for="admin-user-search">Search users</label>
    <input
      id="admin-user-search"
      v-model="searchValue"
      class="input input-bordered w-full min-w-0 sm:flex-1"
      type="search"
      placeholder="Search users"
    />
    <label class="sr-only" for="admin-user-search-field">
      Search field
    </label>
    <select
      id="admin-user-search-field"
      v-model="searchField"
      class="select select-bordered w-full sm:w-auto"
    >
      <option value="name">Name</option>
      <option value="email">Email</option>
    </select>
    <button class="btn btn-primary w-full sm:w-auto" type="submit">Search</button>
  </form>
</template>
