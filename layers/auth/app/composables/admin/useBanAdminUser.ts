import { getErrorMessage } from "#layers/auth/app/utils/error";
import { banAdminUserSchema } from "#shared/auth/schemas/admin";
import type { BanAdminUserInput } from "#shared/auth/types/admin";

const durationMultipliers = {
  seconds: 1,
  minutes: 60,
  hours: 60 * 60,
  days: 24 * 60 * 60,
} as const;

export function useBanAdminUser() {
  const action = useAuthClientAction((client) => client.admin.banUser);
  const fieldErrors = ref<Record<string, string>>({});
  const successMessage = ref<string | null>(null);
  const showActionError = ref(false);
  const loading = computed(() => action.status.value === "pending");
  const error = computed(() =>
    showActionError.value && action.status.value === "error" && action.error.value
      ? getErrorMessage(action.error.value)
      : null,
  );

  function clearState() {
    fieldErrors.value = {};
    successMessage.value = null;
    showActionError.value = false;
  }

  async function submit(input: BanAdminUserInput) {
    clearState();

    const result = banAdminUserSchema.safeParse(input);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors.value[field]) {
          fieldErrors.value[field] = issue.message;
        }
      }
      return;
    }

    const { userId, banReason, duration, durationUnit } = result.data;
    await action.execute({
      userId,
      ...(banReason ? { banReason } : {}),
      ...(duration !== undefined
        ? { banExpiresIn: duration * durationMultipliers[durationUnit] }
        : {}),
    });

    showActionError.value = true;
    if (action.status.value === "success") {
      successMessage.value = "User banned successfully.";
    }
  }

  return {
    fieldErrors,
    loading,
    error,
    successMessage,
    clearState,
    submit,
  };
}
