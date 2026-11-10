import type { SocialProvider } from "#layers/nuxt-auth-layer/app/types/auth";

export function useSocialLogin() {
  const action = useAuthClientAction((client) => client.signIn.social);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function signIn(provider: SocialProvider) {
    await action.execute({
      provider,
      callbackURL: "/app",
    });
  }

  return { loading, error, signIn };
}
