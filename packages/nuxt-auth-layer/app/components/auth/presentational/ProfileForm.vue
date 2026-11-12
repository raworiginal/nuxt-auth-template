<script setup lang="ts">
import type { ProfileFormData } from "#layers/nuxt-auth-layer/app/types/auth";

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
const profileImage = computed({
  get: () => form.image,
  set: (value: string) => {
    form.image = value;
  },
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

      <UFormField label="Name" name="name" :error="fieldErrors.name">
        <UInput
          id="profile-name"
          v-model="form.name"
          name="name"
          autocomplete="name"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Profile image URL"
        name="image"
        :error="fieldErrors.image"
      >
        <UInput
          id="profile-image"
          v-model="profileImage"
          name="image"
          type="url"
          placeholder="https://example.com/avatar.jpg"
          class="w-full"
        />
      </UFormField>

      <div class="mt-4 flex gap-2">
        <UButton type="submit" :loading="loading">
          {{ loading ? "Saving..." : "Save changes" }}
        </UButton>
        <UButton to="/app" color="neutral" variant="outline">Cancel</UButton>
      </div>
    </Fieldset>
  </form>
</template>
