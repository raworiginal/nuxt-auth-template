<script setup lang="ts">
const { loading, logOut } = useAuthClient();
async function handleLogout() {
  const success = await logOut();
  if (success) {
    await navigateTo("/login");
  }
}
</script>
<template>
  <button :disabled="loading" @click="handleLogout">Logout</button>
</template>
