<script setup lang="ts">
const { loggedIn, user } = useUserSession();
</script>

<template>
  <UHeader>
    <template #title>
      <UButton
        to="/"
        color="neutral"
        variant="ghost"
        class="text-xl font-semibold"
      >
        AppName
      </UButton>
    </template>

    <NavMenu :logged-in="loggedIn" horizontal />

    <template #right>
      <NavUserMenu v-if="loggedIn" :user="user" />
    </template>

    <template #body>
      <NavMenu :logged-in="loggedIn" />
    </template>
  </UHeader>
</template>
