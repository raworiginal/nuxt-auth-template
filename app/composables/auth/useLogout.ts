export function useLogout() {
  const action = useSignOut();
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function submit() {
    await action.execute({
      onSuccess: async () => {
        await navigateTo("/login");
      },
    });
  }

  return { loading, error, submit };
}
