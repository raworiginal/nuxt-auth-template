<script setup lang="ts">
const { loggedIn, user } = useUserSession();
const { loading: logoutLoading, submit: logout } = useLogout();
</script>

<template>
  <UHeader>
    <template #left>
      <UButton
        to="/"
        color="neutral"
        variant="ghost"
        class="text-xl font-semibold"
        aria-label="AppName home"
      >
        AppName
      </UButton>
    </template>

    <NavMenu :logged-in="loggedIn" horizontal />

    <template #right>
      <UColorModeButton />
      <NavUserMenu
        v-if="loggedIn"
        :user="user"
        :logout-loading="logoutLoading"
        @logout="logout"
      />
    </template>

    <template #body>
      <NavMenu :logged-in="loggedIn" />
    </template>
  </UHeader>
</template>
