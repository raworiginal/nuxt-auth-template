<script setup lang="ts">
const { loggedIn, user } = useUserSession();
const mobileMenuOpen = ref(false);
</script>
<template>
  <header class="relative flex w-full items-center justify-between gap-4 border-b border-default px-4 py-3">
    <div class="flex items-center gap-2">
      <UButton
        class="lg:hidden"
        color="neutral"
        variant="ghost"
        :icon="mobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
        :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="mobileMenuOpen"
        aria-controls="mobile-navigation"
        @click="mobileMenuOpen = !mobileMenuOpen"
      />
      <UButton to="/" color="neutral" variant="ghost" class="text-xl font-semibold">
        AppName
      </UButton>
    </div>

    <div class="hidden lg:block">
      <NavMenu :logged-in="loggedIn" horizontal />
    </div>

    <NavUserMenu v-if="loggedIn" :user="user" />

    <div
      v-if="mobileMenuOpen"
      id="mobile-navigation"
      class="absolute inset-x-0 top-full z-50 border-b border-default bg-default p-4 shadow-lg lg:hidden"
      @click="mobileMenuOpen = false"
    >
      <NavMenu :logged-in="loggedIn" />
    </div>
  </header>
</template>
