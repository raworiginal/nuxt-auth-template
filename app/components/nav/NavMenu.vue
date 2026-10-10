<script setup lang="ts">
type MenuClasses = "menu" | "menu menu-horizontal px-1";
const props = withDefaults(defineProps<{ menuClasses?: MenuClasses }>(), {
  menuClasses: "menu",
});
</script>
<template>
  <ul :class="props.menuClasses">
    <li><button>Item 1</button></li>
    <li><button>Item 2</button></li>
  </ul>
</template>
