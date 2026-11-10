<script setup lang="ts">
import type { SocialProvider } from "#layers/nuxt-auth-layer/app/types/auth";

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
  return signInSocial(provider);
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
    @submit="submit"
    @social-sign-in="handleSocialSignIn"
  />
</template>
