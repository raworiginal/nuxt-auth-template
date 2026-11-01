<script setup lang="ts">
import type { BanAdminUserFormData } from "~/types/admin";

const props = defineProps<{
  loading: boolean;
  error: string | null;
  successMessage: string | null;
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

function handleSubmit() {
  emit("submit", { ...form });
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <Fieldset :disabled="props.loading" title="Ban user">
      <p v-if="props.error" class="text-error mt-2" role="alert">
        {{ props.error }}
      </p>
      <p v-if="props.successMessage" class="text-success mt-2" role="status">
        {{ props.successMessage }}
      </p>

      <label class="label mt-2" for="admin-ban-user-reason">Reason</label>
      <textarea
        id="admin-ban-user-reason"
        v-model="form.banReason"
        class="textarea w-full"
        name="banReason"
        rows="3"
        :aria-invalid="Boolean(props.fieldErrors.banReason)"
        aria-describedby="admin-ban-user-reason-error"
      />
      <p
        v-if="props.fieldErrors.banReason"
        id="admin-ban-user-reason-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.banReason }}
      </p>

      <label class="label mt-2" for="admin-ban-user-duration">
        Duration (leave blank for permanent)
      </label>
      <div class="flex gap-2">
        <input
          id="admin-ban-user-duration"
          v-model.number="form.duration"
          class="input w-full"
          name="duration"
          type="number"
          min="0"
          step="any"
          :aria-invalid="Boolean(props.fieldErrors.duration)"
          aria-describedby="admin-ban-user-duration-error"
        />
        <select v-model="form.durationUnit" class="select" name="durationUnit">
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
      <p
        v-if="props.fieldErrors.duration"
        id="admin-ban-user-duration-error"
        class="text-error text-sm"
        role="alert"
      >
        {{ props.fieldErrors.duration }}
      </p>

      <button class="btn btn-primary mt-4" type="submit" :disabled="props.loading">
        <span v-if="props.loading" class="loading loading-spinner" />
        {{ props.loading ? "Banning..." : "Ban user" }}
      </button>
    </Fieldset>
  </form>
</template>
