<script setup lang="ts">
const { loading, error, submit } = useRegister();
</script>

<template>
  <RegisterForm
    :loading="loading"
    :error="error"
    @submit="submit"
  />
</template>
