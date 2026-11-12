<script setup lang="ts">
const email = defineModel<string>("email", { required: true });
const name = defineModel<string>("name", { required: true });
const props = defineProps<{ errors: Record<string, string> }>();
</script>

<template>
  <UFormField label="Email" name="email" :error="props.errors.email">
    <UInput
      v-model="email"
      name="email"
      type="email"
      placeholder="Email"
      autocomplete="email"
      class="w-full"
    />
  </UFormField>

  <UFormField label="Name" name="name" :error="props.errors.name">
    <UInput
      v-model="name"
      name="name"
      placeholder="Name"
      autocomplete="name"
      class="w-full"
    />
  </UFormField>
</template>
