<script setup lang="ts">
const password = defineModel<string>("password", {
  required: true,
});

const props = withDefaults(
  defineProps<{
    error?: string;
    id?: string;
    label?: string;
    name?: string;
    placeholder?: string;
    autocomplete?: string;
  }>(),
  {
    id: "password",
    label: "Password",
    name: "password",
    placeholder: "Password",
    autocomplete: "new-password",
  },
);
</script>

<template>
  <label class="label mt-2" :for="props.id">{{ props.label }}</label>
  <input
    :id="props.id"
    v-model="password"
    :name="props.name"
    type="password"
    class="input"
    :placeholder="props.placeholder"
    :autocomplete="props.autocomplete"
    :aria-invalid="Boolean(props.error)"
    :aria-describedby="`${props.id}-error`"
  />
  <p
    v-if="props.error"
    :id="`${props.id}-error`"
    class="text-error text-sm"
    role="alert"
  >
    {{ props.error }}
  </p>
</template>
