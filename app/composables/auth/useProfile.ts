import { profileSchema } from "~/utils/schemas/auth";
import type { ProfileFormData } from "~/types/auth";

export function useProfile() {
  const action = useAuthClientAction((client) => client.updateUser);
  const fieldErrors = ref<Record<string, string>>({});
  const successMessage = ref<string | null>(null);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() => action.error.value?.message ?? null);

  async function submit(input: ProfileFormData) {
    fieldErrors.value = {};
    successMessage.value = null;
    const result = profileSchema.safeParse(input);

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
      image: result.data.image || null,
    });

    if (action.status.value === "success") {
      successMessage.value = "Profile updated successfully.";
    }
  }

  return { fieldErrors, loading, error, successMessage, submit };
}
