<script setup lang="ts">
type MenuClasses = "menu" | "menu menu-horizontal px-1";
const props = withDefaults(
  defineProps<{ menuClasses?: MenuClasses; loggedIn: boolean }>(),
  {
  menuClasses: "menu",
  },
);
</script>
<template>
  <ul :class="props.menuClasses">
    <template v-if="props.loggedIn">
      <li><button>Item 1</button></li>
      <li><button>Item 2</button></li>
    </template>
    <template v-else>
      <li><NuxtLink to="/login">Login</NuxtLink></li>
      <li><NuxtLink to="/register">Register</NuxtLink></li>
    </template>
  </ul>
</template>
