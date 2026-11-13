<script setup lang="ts">
const { fieldErrors, loading, error, submit } = useRegister();

function handleSubmit(input: Parameters<typeof submit>[0]) {
  return submit(input, async () => {
    await navigateTo("/app");
  });
}
</script>

<template>
  <RegisterForm
    :field-errors="fieldErrors"
    :loading="loading"
    :error="error"
    @submit="handleSubmit"
  />
</template>
