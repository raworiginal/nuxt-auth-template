<script setup lang="ts">
import type { ProfileFormData } from "#shared/auth/types/auth";
import { profileSchema } from "#shared/auth/schemas/auth";

const {
  user,
  loading,
  error: authError,
  fieldErrors,
} = defineProps<{
  user: ProfileFormData;
  loading: boolean;
  error: string | null;
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

function handleSubmit(event: { data: ProfileFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UForm :schema="profileSchema" :state="form" @submit="handleSubmit">
    <Fieldset :disabled="loading" title="Edit Profile">
      <p v-if="authError" class="text-error mt-2" role="alert">
        {{ authError }}
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
  </UForm>
</template>
