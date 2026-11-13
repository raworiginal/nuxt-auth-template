<script setup lang="ts">
const { user } = useUserSession();
const {
  fieldErrors: profileFieldErrors,
  loading: profileLoading,
  error: profileError,
  successMessage: profileSuccessMessage,
  submit: submitProfile,
} = useProfile();
const {
  fieldErrors: passwordFieldErrors,
  loading: passwordLoading,
  error: passwordError,
  successMessage: passwordSuccessMessage,
  submit: submitPassword,
} = useChangePassword();

const toast = useToast();

watch(profileSuccessMessage, (message) => {
  if (message) toast.add({ title: message, color: "success" });
});

watch(passwordSuccessMessage, (message) => {
  if (message) toast.add({ title: message, color: "success" });
});
</script>

<template>
  <div v-if="user" class="flex flex-col gap-4 p-4">
    <ProfileForm
      :user="{ name: user.name, image: user.image ?? '' }"
      :field-errors="profileFieldErrors"
      :loading="profileLoading"
      :error="profileError"
      @submit="submitProfile"
    />
    <ChangePasswordForm
      :field-errors="passwordFieldErrors"
      :loading="passwordLoading"
      :error="passwordError"
      @submit="submitPassword"
    />
  </div>
</template>
