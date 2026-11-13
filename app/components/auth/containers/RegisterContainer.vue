<script setup lang="ts">
const { fieldErrors, loading, error, submit } = useRegister();
</script>

<template>
  <RegisterForm
    :field-errors="fieldErrors"
    :loading="loading"
    :error="error"
    @submit="submit"
  />
</template>
