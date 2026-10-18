<script setup lang="ts">
const { data: session } = await useSession(useFetch);
</script>

<template>
  <main v-if="session" class="p-4">
    <ProfileForm
      :user="{
        name: session.user.name,
        image: session.user.image ?? '',
      }"
    />
  </main>
</template>
