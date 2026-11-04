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
  <form class="my-4 flex flex-wrap gap-2" @submit.prevent="submitSearch">
    <label class="sr-only" for="admin-user-search">Search users</label>
    <input
      id="admin-user-search"
      v-model="searchValue"
      class="input input-bordered"
      type="search"
      placeholder="Search users"
    />
    <label class="sr-only" for="admin-user-search-field">
      Search field
    </label>
    <select
      id="admin-user-search-field"
      v-model="searchField"
      class="select select-bordered"
    >
      <option value="name">Name</option>
      <option value="email">Email</option>
    </select>
    <button class="btn btn-primary" type="submit">Search</button>
  </form>
</template>
