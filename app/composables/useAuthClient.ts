import { input } from "zod";
import { type RegisterInput } from "~/types/auth";
function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function useAuthClient() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function register(input: RegisterInput) {
    loading.value = true;
    error.value = null;

    try {
      const response = await signUp.email({
        email: input.email,
        name: input.email,
        password: input.password,
      });

      if (response.error) {
        error.value = getErrorMessage(response.error);
        return null;
      }
      return response.data;
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError);
      return null;
    } finally {
      loading.value = false;
    }
  }
  return { register, loading, error };
}
