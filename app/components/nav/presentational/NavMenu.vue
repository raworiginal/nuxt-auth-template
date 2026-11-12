<script setup lang="ts">
const props = withDefaults(
  defineProps<{ horizontal?: boolean; loggedIn: boolean }>(),
  { horizontal: false },
);
</script>
<template>
  <nav aria-label="Main navigation">
    <ul
      class="flex gap-2"
      :class="props.horizontal ? 'flex-row items-center' : 'flex-col'"
    >
      <template v-if="props.loggedIn">
        <li><UButton color="neutral" variant="ghost">Item 1</UButton></li>
        <li><UButton color="neutral" variant="ghost">Item 2</UButton></li>
      </template>
      <template v-else>
        <li><UButton to="/login" color="neutral" variant="ghost">Login</UButton></li>
        <li><UButton to="/register" color="neutral" variant="ghost">Register</UButton></li>
      </template>
    </ul>
  </nav>
</template>
