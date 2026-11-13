<script setup lang="ts">
import type { BanAdminUserFormData } from "#shared/auth/types/admin";
import { banAdminUserSchema } from "#shared/auth/schemas/admin";

const formSchema = banAdminUserSchema.omit({ userId: true });

const props = defineProps<{
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}>();

const emit = defineEmits<{
  submit: [input: BanAdminUserFormData];
}>();

const form = reactive<BanAdminUserFormData>({
  banReason: "",
  duration: undefined,
  durationUnit: "days",
});

function handleSubmit(event: { data: BanAdminUserFormData }) {
  emit("submit", { ...event.data });
}
</script>

<template>
  <UForm :schema="formSchema" :state="form" @submit="handleSubmit">
    <Fieldset :disabled="props.loading" title="Ban user">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <UFormField
        label="Reason"
        name="banReason"
        :error="props.fieldErrors.banReason"
      >
        <UTextarea
          id="admin-ban-user-reason"
          v-model="form.banReason"
          name="banReason"
          :rows="3"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Duration (leave blank for permanent)"
        name="duration"
        :error="props.fieldErrors.duration"
      >
        <div class="flex gap-2">
          <UInput
            id="admin-ban-user-duration"
            v-model.number="form.duration"
            class="w-full"
            name="duration"
            type="number"
            min="0"
            step="any"
          />
          <USelect
            v-model="form.durationUnit"
            name="durationUnit"
            :items="[
              { label: 'Seconds', value: 'seconds' },
              { label: 'Minutes', value: 'minutes' },
              { label: 'Hours', value: 'hours' },
              { label: 'Days', value: 'days' },
            ]"
          />
        </div>
      </UFormField>

      <UButton class="mt-4" type="submit" :loading="props.loading">
        {{ props.loading ? "Banning..." : "Ban user" }}
      </UButton>
    </Fieldset>
  </UForm>
</template>
