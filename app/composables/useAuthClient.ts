import { type RegisterInput, type LoginInput } from "~/types/auth";
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

  async function login(input: LoginInput) {
    loading.value = true;
    error.value = null;

    try {
      const response = await signIn.email({
        email: input.email,
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

  async function logOut() {
    loading.value = true;
    error.value = null;

    try {
      const response = await signOut();

      if (response.error) {
        error.value = getErrorMessage(response.error);
        return false;
      }

      return true;
    } catch (caughtError) {
      error.value = getErrorMessage(caughtError);
      return false;
    } finally {
      loading.value = false;
    }
  }
  return { login, logOut, register, loading, error };
}
