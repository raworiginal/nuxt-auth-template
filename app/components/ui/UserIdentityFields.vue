<script setup lang="ts">
const email = defineModel<string>("email", { required: true });
const name = defineModel<string>("name", { required: true });
const props = defineProps<{ errors: Record<string, string> }>();
</script>

<template>
  <label class="label" for="email">Email</label>
  <input
    id="email"
    v-model="email"
    name="email"
    type="email"
    class="input"
    placeholder="Email"
    autocomplete="email"
    :aria-invalid="Boolean(props.errors.email)"
    aria-describedby="register-email-error"
  />

  <p
    v-if="props.errors.email"
    id="email-error"
    class="text-error text-sm"
    role="alert"
  >
    {{ props.errors.email }}
  </p>

  <label class="label" for="name">Name</label>
  <input
    id="name"
    v-model="name"
    name="name"
    type="text"
    class="input"
    placeholder="Name"
    autocomplete="name"
    :aria-invalid="Boolean(props.errors.name)"
    aria-describedby="register-name-error"
  />
  <p
    v-if="props.errors.name"
    id="name-error"
    class="text-error text-sm"
    role="alert"
  >
    {{ props.errors.name }}
  </p>
</template>
