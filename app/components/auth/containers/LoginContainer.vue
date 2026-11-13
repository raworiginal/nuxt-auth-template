<script setup lang="ts">
import type { SocialProvider } from "#shared/auth/types/auth";

const { fieldErrors, loading, error, submit } = useLogin();
const { data: socialProviders } = await useFetch<SocialProvider[]>(
  "/api/auth/social-providers",
  { default: () => [] },
);
const {
  loading: socialLoading,
  error: socialError,
  signIn: signInSocial,
} = useSocialLogin();

function handleSocialSignIn(provider: SocialProvider) {
  return signInSocial(provider, "/app");
}

function handleSubmit(input: Parameters<typeof submit>[0]) {
  return submit(input, async () => {
    await navigateTo("/app");
  });
}
</script>

<template>
  <LoginForm
    :field-errors="fieldErrors"
    :loading="loading"
    :error="error"
    :social-providers="socialProviders"
    :social-loading="socialLoading"
    :social-error="socialError"
    @submit="handleSubmit"
    @social-sign-in="handleSocialSignIn"
  />
</template>
