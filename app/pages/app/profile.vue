<script setup lang="ts">
const { data: session } = await useSession(useFetch);
const passwordModalOpen = ref(false);
</script>

<template>
  <main v-if="session" class="p-4">
    <ProfileForm
      :user="{
        name: session.user.name,
        image: session.user.image ?? '',
      }"
    />

    <button
      class="btn btn-secondary mt-4"
      type="button"
      @click="passwordModalOpen = true"
    >
      Change password
    </button>

    <Modal v-model="passwordModalOpen" title="Change password">
      <PasswordForm @success="passwordModalOpen = false" />
    </Modal>
  </main>
</template>
