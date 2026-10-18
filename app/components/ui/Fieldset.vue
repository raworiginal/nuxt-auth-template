<script setup lang="ts">
defineProps<{
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset
    :disabled="disabled"
    class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
  >
    <slot />
  </fieldset>
</template>
