<script setup lang="ts">
type MenuClasses = "menu" | "menu menu-horizontal px-1";
const props = withDefaults(defineProps<{ menuClasses?: MenuClasses }>(), {
  menuClasses: "menu",
});
const session = useSession();
</script>
<template>
  <ul :class="props.menuClasses">
    <div v-if="session.data">
      <li><button>Item 1</button></li>
      <li><button>Item 2</button></li>
    </div>
    <div v-else>
      <li><NuxtLink to="/login">Login</NuxtLink></li>
      <li><NuxtLink to="/register">Register</NuxtLink></li>
    </div>
  </ul>
</template>
