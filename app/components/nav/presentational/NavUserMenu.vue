<script setup lang="ts">
const props = defineProps<{
  user: {
    name: string;
    image?: string | null;
    role?: string | null;
  } | null;
}>();

const { loading, submit } = useLogout();

const items = computed(() => [
  [
    ...(props.user ? [{ label: `Hello, ${props.user.name}`, disabled: true }] : []),
    { label: "Profile", to: "/app/profile" },
    ...(props.user?.role === "admin"
      ? [{ label: "Admin Panel", to: "/admin" }]
      : []),
  ],
  [{ label: "Logout", disabled: loading.value, onSelect: () => submit() }],
]);
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'end' }">
    <UButton
      color="neutral"
      variant="ghost"
      :aria-label="`Open menu for ${props.user?.name ?? 'user'}`"
    >
      <UAvatar
        :src="props.user?.image ?? undefined"
        :alt="props.user ? `${props.user.name}'s avatar` : 'User avatar'"
        :text="props.user?.name?.charAt(0).toUpperCase()"
      />
    </UButton>
  </UDropdownMenu>
</template>
