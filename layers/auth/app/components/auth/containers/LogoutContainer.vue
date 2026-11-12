<script setup lang="ts">
const { loading, submit } = useLogout();
</script>

<template>
  <LogOutButton :loading="loading" @click="submit" />
</template>
