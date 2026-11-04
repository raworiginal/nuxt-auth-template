<script setup lang="ts">
const { fieldErrors, loading, error, submit } = useLogin();
</script>

<template>
  <LoginForm
    :field-errors="fieldErrors"
    :loading="loading"
    :error="error"
    @submit="submit"
  />
</template>
