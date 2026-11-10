<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button :disabled="loading" @click="emit('click')">Logout</button>
</template>
