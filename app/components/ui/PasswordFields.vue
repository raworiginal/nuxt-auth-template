<script setup lang="ts">
const password = defineModel<string>("password", {
  required: true,
});

const confirmPassword = defineModel<string>("confirmPassword", {
  required: true,
});

const props = defineProps<{
  errors: Record<string, string>;
}>();
</script>

<template>
  <label class="label mt-2" for="register-password">Password</label>
  <input
    id="password"
    v-model="password"
    name="password"
    type="password"
    class="input w-full"
    placeholder="Password"
    autocomplete="new-password"
    :aria-invalid="Boolean(props.errors.password)"
    aria-describedby="register-password-error"
  />
  <p
    v-if="props.errors.password"
    id="password-error"
    class="text-error text-sm"
    role="alert"
  >
    {{ props.errors.password }}
  </p>

  <label class="label" for="confirm-password"> Confirm Password </label>
  <input
    id="confirm-password"
    v-model="confirmPassword"
    name="confirmPassword"
    type="password"
    class="input w-full"
    placeholder="Confirm Password"
    autocomplete="new-password"
    :aria-invalid="Boolean(props.errors.confirmPassword)"
    aria-describedby="register-confirm-password-error"
  />
  <p
    v-if="props.errors.confirmPassword"
    id="register-confirm-password-error"
    class="text-error text-sm"
    role="alert"
  >
    {{ props.errors.confirmPassword }}
  </p>
</template>
