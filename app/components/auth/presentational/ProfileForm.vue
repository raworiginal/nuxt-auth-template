<script setup lang="ts">
import type { ProfileFormData } from "~/types/auth";

const {
  user,
  loading,
  error: authError,
  successMessage,
  fieldErrors,
} = defineProps<{
  user: ProfileFormData;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: ProfileFormData];
}>();

const form = reactive<ProfileFormData>({
  name: user.name,
  image: user.image,
});

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="loading" title="Edit Profile">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
      </p>
      <p v-if="successMessage" class="text-success mt-2" role="status">
        {{ successMessage }}
      </p>

      <label class="label" for="profile-name">Name</label>
      <input
        id="profile-name"
        v-model="form.name"
        name="name"
        type="text"
        class="input"
        autocomplete="name"
        :aria-invalid="Boolean(fieldErrors.name)"
        aria-describedby="profile-name-error"
      />
      <p
        v-if="fieldErrors.name"
        id="profile-name-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.name }}
      </p>

      <label class="label" for="profile-image">Profile image URL</label>
      <input
        id="profile-image"
        v-model="form.image"
        name="image"
        type="url"
        class="input"
        placeholder="https://example.com/avatar.jpg"
        :aria-invalid="Boolean(fieldErrors.image)"
        aria-describedby="profile-image-error"
      />
      <p
        v-if="fieldErrors.image"
        id="profile-image-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ fieldErrors.image }}
      </p>

      <div class="mt-4 flex gap-2">
        <button class="btn btn-primary" type="submit">
          <span v-if="loading" class="loading loading-spinner" />
          {{ loading ? "Saving..." : "Save changes" }}
        </button>
        <NuxtLink class="btn btn-error" to="/app">Cancel</NuxtLink>
      </div>
    </Fieldset>
  </form>
</template>
