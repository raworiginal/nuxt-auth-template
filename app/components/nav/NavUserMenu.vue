<script setup lang="ts">
const { data: session } = await useSession(useFetch);
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          v-if="session?.user.image"
          :src="session.user.image"
          :alt="`${session.user.name}'s avatar`"
        />
        <span
          v-else
          class="flex h-full w-full items-center justify-center bg-secondary text-secondary-content"
          aria-hidden="true"
        >
          {{ session?.user.name?.charAt(0).toUpperCase() }}
        </span>
      </div>
    </div>
    <ul
      tabindex="-1"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
      <li v-if="session">Hello, {{ session.user.name }}</li>
      <li>
        <NuxtLink to="/app/profile" class="justify-between"> Profile </NuxtLink>
      </li>
      <li><LogOutButton /></li>
    </ul>
  </div>
</template>
