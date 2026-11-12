<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <UButton color="neutral" variant="ghost" :disabled="loading" @click="emit('click')">
    Logout
  </UButton>
</template>
