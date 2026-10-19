<script setup lang="ts">
import { nextTick, onMounted, ref, useId, watch } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    closeOnBackdrop?: boolean;
  }>(),
  {
    closeOnBackdrop: true,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const titleId = useId();

function close() {
  emit("update:modelValue", false);
}

function syncDialog() {
  if (!dialog.value) return;

  if (props.modelValue && !dialog.value.open) {
    dialog.value.showModal();
  } else if (!props.modelValue && dialog.value.open) {
    dialog.value.close();
  }
}

function handleCancel(event: Event) {
  event.preventDefault();
  close();
}

function handleNativeClose() {
  if (props.modelValue) close();
}

function handleBackdropSubmit(event: Event) {
  event.preventDefault();
  if (props.closeOnBackdrop) close();
}

watch(() => props.modelValue, syncDialog);

onMounted(() => {
  nextTick(syncDialog);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    aria-modal="true"
    :aria-label="title ? undefined : 'Dialog'"
    :aria-labelledby="title ? titleId : undefined"
    @cancel="handleCancel"
    @close="handleNativeClose"
  >
    <div class="modal-box" @click.stop>
      <div class="flex items-start justify-between gap-4">
        <h2 v-if="title" :id="titleId" class="text-lg font-bold">
          {{ title }}
        </h2>
        <button
          type="button"
          class="btn btn-sm btn-circle btn-ghost ml-auto"
          aria-label="Close dialog"
          @click="close"
        >
          ✕
        </button>
      </div>

      <div class="mt-4">
        <slot />
      </div>
    </div>

    <form method="dialog" class="modal-backdrop" @submit="handleBackdropSubmit">
      <button type="submit" aria-label="Close dialog">close</button>
    </form>
  </dialog>
</template>
