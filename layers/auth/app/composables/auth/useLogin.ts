import { loginSchema } from "#shared/auth/schemas/auth";
import type { LoginFormData } from "#shared/auth/types/auth";

export function useLogin() {
  const action = useSignIn("email");
  const fieldErrors = ref<Record<string, string>>({});
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function submit(
    input: LoginFormData,
    onSuccess?: () => void | Promise<unknown>,
  ) {
    fieldErrors.value = {};
    const result = loginSchema.safeParse(input);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    await action.execute(result.data, {
      onSuccess: async () => {
        await onSuccess?.();
      },
    });
  }

  return { fieldErrors, loading, error, submit };
}
