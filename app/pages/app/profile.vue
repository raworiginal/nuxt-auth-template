<script setup lang="ts">
const { data: session } = await useSession(useFetch);
</script>

<template>
  <main v-if="session" class="flex flex-col gap-4 p-4">
    <ProfileForm
      :user="{
        name: session.user.name,
        image: session.user.image ?? '',
      }"
    />
    <ChangePasswordForm />
  </main>
</template>
