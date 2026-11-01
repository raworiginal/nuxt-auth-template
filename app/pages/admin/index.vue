<script setup lang="ts">
definePageMeta({
  middleware: "admin",
});

const { listUsers, loading, error } = useAdminClient();
loading.value = true;

type ListUsersResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;

const users = ref<ListUsersResult["users"]>([]);
const total = ref(0);

async function loadUsers() {
  const result = await listUsers({
    limit: 10,
    offset: 0,
  });
  if (!result) {
    return;
  }

  users.value = result.users;
  total.value = result.total;
}

onMounted(loadUsers);
</script>
<template>
  <main>
    <h1>Users</h1>

    <p v-if="loading">Loading users...</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else-if="users.length === 0">No users found.</p>
    <p v-else>{{ total }} users found.</p>
  </main>
</template>
