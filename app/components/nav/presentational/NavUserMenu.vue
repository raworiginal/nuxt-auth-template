<script setup lang="ts">
const { user } = defineProps<{
  user: {
    name: string;
    image?: string | null;
  } | null;
}>();
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          v-if="user?.image"
          :src="user.image"
          :alt="`${user.name}'s avatar`"
        />
        <span
          v-else
          class="flex h-full w-full items-center justify-center bg-secondary text-secondary-content"
          aria-hidden="true"
        >
          {{ user?.name?.charAt(0).toUpperCase() }}
        </span>
      </div>
    </div>
    <ul
      tabindex="-1"
      class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
    >
       <li v-if="user">Hello, {{ user.name }}</li>
      <li>
        <NuxtLink to="/app/profile" class="justify-between"> Profile </NuxtLink>
      </li>
       <li><LogoutContainer /></li>
    </ul>
  </div>
</template>
