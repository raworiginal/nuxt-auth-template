import { registerSchema } from "~/utils/schemas/auth";
import type { RegisterFormData } from "~/types/auth";

export function useRegister() {
  const action = useSignUp("email");
  const fieldErrors = ref<Record<string, string>>({});
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function submit(input: RegisterFormData) {
    fieldErrors.value = {};
    const result = registerSchema.safeParse(input);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    await action.execute(
      {
        email: result.data.email,
        name: result.data.name,
        password: result.data.password,
      },
      {
        onSuccess: async () => {
          await navigateTo("/app");
        },
      },
    );
  }

  return { fieldErrors, loading, error, submit };
}
