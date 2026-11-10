import { getErrorMessage } from "#layers/nuxt-auth-layer/app/utils/error";
import { createAdminUserSchema } from "#layers/nuxt-auth-layer/app/utils/schemas/admin";
import type { CreateAdminUserFormData } from "#layers/nuxt-auth-layer/app/types/admin";

export function useCreateAdminUser() {
  const action = useAuthClientAction((client) => client.admin.createUser);
  const fieldErrors = ref<Record<string, string>>({});
  const successMessage = ref<string | null>(null);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() =>
    action.error.value ? getErrorMessage(action.error.value) : null,
  );

  async function submit(input: CreateAdminUserFormData) {
    fieldErrors.value = {};
    successMessage.value = null;

    const result = createAdminUserSchema.safeParse(input);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    await action.execute({
      name: result.data.name,
      email: result.data.email,
      password: result.data.password,
      role: result.data.role,
    });

    if (action.status.value === "success") {
      successMessage.value = "User created successfully.";
    }
  }

  return { fieldErrors, loading, error, successMessage, submit };
}
