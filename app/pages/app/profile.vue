<script setup lang="ts">
const { data: session } = await useSession(useFetch);
</script>
<template>
  <div v-if="session">{{ session.user.name }}</div>
</template>
